# Whoopsie

Whoopsie is a command-line tool that watches specified files and directories and creates periodic zip backups of specified file types, respecting `.gitignore` rules. It's perfect for creating quick, automatic backups of your projects.

Basically, it's a way of automating the dumb-dumb backups I already do when working on a git project and I know I'll forget to commit regularly.  

Built for MacOS, could probably be ported elsewhere without too much effort.

## Features

- Watch specified files and directories for changes
- Create zip backups of specified file types
- Respect `.gitignore` rules (searches parent directories for .gitignore)
- Customizable backup interval
- Customizable backup save location
- Option to watch only specific files or directories
- Option to add custom ignore patterns
- Easy to install and use globally

## Installation

To install Whoopsie globally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/laffan/whoopsie.git
   cd whoopsie
   ```

2. Install dependencies and build the package:
   ```
   npm install
   npm run build
   ```

3. Create a global symlink:
   ```
   npm link
   ```

Now, you can use the `whoopsie` command from anywhere in your system.

## Usage

The basic syntax for using Whoopsie is:

```
whoopsie [projectName] [filetypes] [options]
```

- `projectName`: Name of your project (required)
- `filetypes`: Comma-separated list of file extensions to backup (default: .js,.css,.html)

Options:
- `-s, --seconds <seconds>`: Set the interval between backups in seconds (default: 30)
- `--saveTo <path>`: Specify a custom save location for backups
- `--only <paths>`: Watch only specified files/folders (comma-separated list of paths)
- `--ignore <patterns>`: Additional patterns to ignore (comma-separated)

Examples:

1. Basic usage (watches entire current directory):
   ```
   whoopsie myProject .js,.css,.html --seconds 60
   ```

2. With custom save path:
   ```
   whoopsie myProject .js,.css,.html --seconds 60 --saveTo /custom/save/path
   ```

3. Watch only specific files/folders:
   ```
   whoopsie myProject .js,.css,.html --only src,public/images,index.html
   ```

4. Add custom ignore patterns:
   ```
   whoopsie myProject .js,.css,.html --ignore node_modules,*.log
   ```

5. Combining options:
   ```
   whoopsie myProject .js,.css,.html --seconds 120 --saveTo /custom/save/path --only src,public --ignore temp,*.bak
   ```

This will watch the specified files and directories, creating backups of specified file types at the given interval, and save the backups to the specified location or `~/Documents/Whoopsie/[projectName]` if not specified.

## Development

To make changes to Whoopsie:

1. Make your code changes
2. Run `npm run build` to rebuild the package
3. The global `whoopsie` command will automatically use your updated version

## Uninstalling

To remove the global symlink:

```
npm unlink whoopsie
```

## License

Whoopsie is a free-for all.
