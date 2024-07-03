import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Whoopsie',
      fileName: (format) => `whoopsie.${format}.js`
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'archiver',
        'chokidar',
        'commander',
        'ignore',
        'readline'
      ],
      output: {
        globals: {
          fs: 'fs',
          path: 'path',
          archiver: 'archiver',
          chokidar: 'chokidar',
          commander: 'commander',
          ignore: 'ignore',
          readline: 'readline'
        }
      }
    },
    target: 'node14',
    minify: false,
  },
  plugins: [
    {
      name: 'generate-bin-file',
      closeBundle() {
        const binDir = path.resolve(__dirname, 'bin');
        if (!fs.existsSync(binDir)) {
          fs.mkdirSync(binDir);
        }
        const binFile = path.join(binDir, 'whoopsie.js');
        const content = `#!/usr/bin/env node
import { cli } from '../dist/whoopsie.es.js';
cli();
`;
        fs.writeFileSync(binFile, content);
        fs.chmodSync(binFile, '755'); // This sets the file as executable
      }
    }
  ]
});