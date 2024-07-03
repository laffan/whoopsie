# Whoopsie!

Whoopsie is a command-line tool that watches specified files and directories and creates periodic zip backups of specified file types, respecting `.gitignore` rules. 

Basically, it's a way of automating the dumb-dumb backups I already do when working on a git project.  

## Features

- Watch specified files and directories for changes
- Create zip backups of specified file types
- Respect `.gitignore` rules (searches parent directories for .gitignore)
- Customizable backup interval
- Customizable backup save location
- Option to watch only specific files or directories
- Option to add custom ignore patterns

## Installation

To install Whoopsie globally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whoopsie.git
   cd whoopsie
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the package:
   ```
   npm run build
   ```

4. Create a global symlink:
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
- `--seconds <n>`: Set the interval between backups in seconds (default: 30)
- `--saveTo <path>`: Specify a custom save location for backups
- `--only <items>`: Watch only specified files/folders (comma-separated)
- `--ignore <patterns>`: Additional patterns to ignore (comma-separated)

Examples:

1. Basic usage (watches entire current directory):
   ```
   cd /path/to/your/project
   whoopsie myProject .js,.css,.html --seconds 60
   ```

2. With custom save path:
   ```
   whoopsie myProject .js,.css,.html --seconds 60 --saveTo /custom/save/path
   ```

3. Watch only specific files/folders:
   ```
   whoopsie myProject .js,.css,.html --only src,public,index.html
   ```

4. Add custom ignore patterns:
   ```
   whoopsie myProject .js,.css,.html --ignore node_modules,*.log
   ```

5. Combining options:
   ```
   whoopsie myProject .js,.css,.html --seconds 120 --saveTo /custom/save/path --only src,public --ignore temp,*.bak
   ```

## .gitignore Behavior

Whoopsie will search for a `.gitignore` file in the current directory and its parent directories. If found, it will use the rules in that file to determine which files to ignore. If no `.gitignore` file is found, Whoopsie will prompt the user to confirm if they want to proceed without it.

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