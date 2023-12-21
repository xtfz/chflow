const fs = require("fs");
const Table = require("cli-table");
const chalk = require("chalk");
const getProjectData = require("../utils/getProjectData");
const moment = require("moment");

module.exports = async (options) => {
  try {
    if (fs.existsSync(".changeflow.json") == false) {
      console.log(
        chalk.redBright.bold(
          '\n[ERROR] — This directory is not connected to any project on ChangeFlow; Run "chflow init" to get started.'
        )
      );
      process.exit(1);
    }

    const configData = require(`${process.cwd()}/.changeflow.json`);
    const slug = configData.project.slug;
    const id = configData.userID;
    const key = configData.key;

    const projectChangelogs = await getProjectData(slug, id, key);

    /* table format
     *    created     version     title       beta
     */

    const table = new Table({
      head: ["CREATED", "VERSION", "TITLE", "BETA"],
      colWidths: [20, 10, 30, 10],
    });

    if (options.sort == "oldest_first") {
      projectChangelogs.project.changelogs.sort(
        (a, b) => a.created - b.created
      );
    } else {
      projectChangelogs.project.changelogs.sort(
        (a, b) => b.created - a.created
      );
    }

    const sortedLogs = projectChangelogs.project.changelogs;

    for (let i = 0; i < options.max; i++) {
      const log = sortedLogs[i];
      if (log == undefined) break;
      table.push([
        moment(log.created).format("DD/MM/YY h:mm:ss"),
        log.version,
        log.title == null ? "—" : log.title,
        log.beta ? "Yes" : "No",
      ]);
    }

    // console.log("\n")
    console.log(table.toString());
    process.exit();
  } catch (e) {
    console.log(chalk.redBright.bold("An internal error has occured"), e);
  }
};
