#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import chokidar from 'chokidar';
import { program } from 'commander';
import ignore from 'ignore';
import readline from 'readline';

const DEFAULT_SAVE_PATH = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', 'Whoopsie');
const DEFAULT_INTERVAL = 60;

function findGitignore(directory) {
  const gitignorePath = path.join(directory, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    return gitignorePath;
  }
  const parentDir = path.dirname(directory);
  if (parentDir === directory) {
    return null;
  }
  return findGitignore(parentDir);
}

function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function whoopsie(projectName, fileTypes, options) {
  const watchPath = process.cwd();
  const savePath = path.join(options.saveTo || DEFAULT_SAVE_PATH, projectName);
  const interval = options.seconds * 1000 || DEFAULT_INTERVAL * 1000;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  const gitignorePath = findGitignore(watchPath);
  const ig = ignore();
  
  if (!gitignorePath) {
    const proceed = await promptUser("No .gitignore file found. Do you want to proceed without it? (y/n): ");
    if (!proceed) {
      console.log("Whoopsie aborted. Please create a .gitignore file and try again.");
      process.exit(1);
    }
  } else {
    ig.add(fs.readFileSync(gitignorePath).toString());
    console.log(`Using .gitignore file found at: ${gitignorePath}`);
  }
  
  // Add custom ignore patterns
  if (options.ignore) {
    ig.add(options.ignore);
  }

  let watchPaths = [watchPath];
  if (options.only) {
    watchPaths = options.only.map(item => path.join(watchPath, item));
  }

  const watcher = chokidar.watch(watchPaths, {
    ignored: (filePath) => ig.ignores(path.relative(watchPath, filePath)),
    persistent: true
  });

  function zipFiles() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const output = fs.createWriteStream(path.join(savePath, `backup-${timestamp}.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Backup created: ${archive.pointer()} total bytes`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    const filesToZip = [];
    const watched = watcher.getWatched();
    Object.keys(watched).forEach((dir) => {
      watched[dir].forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isFile() && fileTypes.some(type => fullPath.endsWith(type))) {
          filesToZip.push(fullPath);
        }
      });
    });

    filesToZip.forEach((file) => {
      archive.file(file, { name: path.relative(watchPath, file) });
    });

    archive.finalize();
  }

  setInterval(zipFiles, interval);
  console.log(`Whoopsie is watching ${watchPath} and saving backups to ${savePath} every ${interval / 1000} seconds.`);
  if (options.only) {
    console.log(`Only watching these files/folders: ${options.only.join(', ')}`);
  }
  if (options.ignore) {
    console.log(`Additional ignore patterns: ${options.ignore.join(', ')}`);
  }
}

export function cli() {
  program
    .argument('<projectName>', 'Name of the project')
    .argument('[fileTypes]', 'Comma-separated list of file types to backup', '.js,.css,.html')
    .option('-s, --seconds <seconds>', 'Interval in seconds between backups', DEFAULT_INTERVAL.toString())
    .option('--saveTo <path>', 'Custom save path')
    .option('--only <items>', 'Watch only specified files/folders (comma-separated)')
    .option('--ignore <patterns>', 'Additional patterns to ignore (comma-separated)')
    .action(async (projectName, fileTypes, options) => {
      await whoopsie(projectName, fileTypes.split(','), {
        ...options,
        only: options.only ? options.only.split(',') : undefined,
        ignore: options.ignore ? options.ignore.split(',') : undefined
      });
    });

  program.parse();
}