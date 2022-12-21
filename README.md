# Project Time

This extension intends to give you a way to track the amount of time you spend in your VS Code projects.

It was created for personal use, but is a great tool for freelancers and consultants who bill hourly and want to track their time.

## Features

Once the extension is installed and activated, a sqlite3 database called `project-time.db` will be created in the `vscode.ExtensionContext.globalStorageUri` directory. This directory will correspond to a path similar to  `~/Library/Application Support/Code/User/globalStorage` on macOS and `%appdata%\Code\User\globalStorage` on windows.

Once the extension is activated, this database is used to automatically track all the time spent in VS Code across your various projects. Time tracking starts when a window is focused and stops when a code window loses focus.

The extension provides some basic ways to extract data from this database (in `JSON` format), however you can feel free to connect to this database to extract your data as you need.

### Commands

* `Project Time: Export all` - Export all time data (split by project) to a JSON file.
* `Project Time: Export` - Export time data between two dates (split by project) to a JSON file.

## Issues

Feel free to report any issues [here](https://github.com/RatulMaharaj/project-time/issues).

**Enjoy!**
