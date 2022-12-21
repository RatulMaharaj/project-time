import * as vscode from "vscode";
import { init } from "./init";
import {
  getCurrentProject,
  getTodaysTime,
  startTimeTracking,
  stopTimeTracking,
} from "./helpers";
import { exportAllTimes, exportTimesBetween } from "./exports";

let db: any;
let myStatusBarItem: vscode.StatusBarItem;

// This method is called when your extension is activated.
export function activate(context: vscode.ExtensionContext) {
  console.log("Activating Project Time");
  // Get the current project name
  const currentProject = getCurrentProject();

  // Initialize the required folders and sqlite database
  db = init(context);

  // only track time if in a project folder
  if (currentProject !== undefined) {
    // Start time tracking
    startTimeTracking(db, currentProject);

    // Check for changes in editor focus
    vscode.window.onDidChangeWindowState((e) => {
      // if within a project folder
      if (e.focused === true) {
        startTimeTracking(db, currentProject);
      } else {
        stopTimeTracking(db);
      }
    });
  }

  // register a command that is invoked when the status bar
  // item is selected
  const myCommandId = "project-time.todays-time";
  context.subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
      vscode.window.showInformationMessage(
        `Project Time is active!`
      );
    })
  );

  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    200
  );
  myStatusBarItem.command = myCommandId;
  context.subscriptions.push(myStatusBarItem);

  // register some listener that make sure the status bar
  // item always up-to-date
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState(updateStatusBarItem)
  );

  // command to export all times
  const exportAll = vscode.commands.registerCommand(
    "project-time.export-json",
    () => {
      exportAllTimes(db);
    }
  );
  context.subscriptions.push(exportAll);

  // command to export all times between two dates
  const exportBetween = vscode.commands.registerCommand(
    "project-time.export-between-json",
    () => {
      exportTimesBetween(db);
    }
  );
  context.subscriptions.push(exportBetween);

  // update status bar item once at start
  updateStatusBarItem();
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Project Time: Deactivating");
  stopTimeTracking(db);
  db.close();
}

// update status bar item
function updateStatusBarItem() {
  console.log("Project Time: Updating status bar!");
  getTodaysTime(db).then((todaysTime) => {
    console.log("Todays Time is", todaysTime);
    myStatusBarItem.text = `$(clock) ${todaysTime}`;
    myStatusBarItem.tooltip = `Your time spent in VS Code today is ${todaysTime}`;
    myStatusBarItem.show();
  });
}
