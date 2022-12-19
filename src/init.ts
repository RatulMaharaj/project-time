import * as vscode from "vscode";
import fs = require("fs");

const sqlite3 = require("sqlite3").verbose();

export function init(context: vscode.ExtensionContext) {
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
  let db = new sqlite3.Database(storagePath + "/project-time.db");

  // Create table if it doesn't already exist
  db.run(
    "CREATE TABLE IF NOT EXISTS Time (id TEXT, project TEXT, start INTEGER, end INTEGER)"
  );

  return db;
}
