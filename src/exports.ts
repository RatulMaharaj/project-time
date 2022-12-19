import * as vscode from "vscode";
import { fetchAllRowsAfter, prettyTime, exportJSONData } from "./helpers";

export function exportAllTimes(db: any) {
  // Display a message box to the user
  vscode.window.showInformationMessage(
    "Project Time: Exporting your time data."
  );

  fetchAllRowsAfter(db).then(async (data) => {
    // create a new object of project names
    let projects: any = {};
    // loop through the data
    data.forEach((row) => {
      // if the project name is not in the object
      if (!projects[row.project]) {
        projects[row.project] = {
          msDuration: 0,
        };
      }
      if (row.end !== null) {
        projects[row.project].msDuration += row.end - row.start;
      }
    });

    // find min date in data
    let minDate = new Date(
      Math.min.apply(
        null,
        data.map((d) => d.start)
      )
    );

    // find max date in data
    let maxDate = new Date(
      Math.max.apply(
        null,
        data.map((d) => d.end)
      )
    );

    // add start and end date to projects object
    projects.startDate = minDate;
    projects.endDate = maxDate;

    // add pretty duration to each project
    for (const project in projects) {
      projects[project].duration = prettyTime(projects[project].msDuration);
    }

    // export the data
    await exportJSONData(projects);
  });
}
