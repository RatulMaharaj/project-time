import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

const sqlite3 = require("sqlite3").verbose();

export function init(context: vscode.ExtensionContext) {
  // get the path the vs code extension is running in
  const extensionPath = context.extensionUri.fsPath;

  // run npm rebuild to install sqlite3
  console.log("Project Time: Running npm rebuild");
  const npmRebuild = require("child_process").execSync("npm rebuild", {
    cwd: extensionPath,
  });

  // get the path to the global storage folder
  const storagePath = context.globalStorageUri.fsPath;

  // Create storage path if it doesn't already exist
  if (!fs.existsSync(storagePath)) {
    console.log(
      `ProjectTime: Creating folder in global storage: ${storagePath}`
    );
    fs.mkdirSync(storagePath);
  }

  console.log("ProjectTime: Initializing SQLITE database");
  // Create or connect to sqlite database
  const pathToDatabase = path.join(storagePath, "project-time.db");
  let db = new sqlite3.Database(pathToDatabase);

  // Create table if it doesn't already exist
  db.run(
    "CREATE TABLE IF NOT EXISTS Time (id TEXT, project TEXT, start INTEGER, end INTEGER)"
  );

  return db;
}
