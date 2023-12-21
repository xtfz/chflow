const chalk = require("chalk");
const fs = require("fs");
const getProjectData = require("../utils/getProjectData");
// const Date = require("../utils/timeConv");

module.exports = async () => {
  try {
    if (fs.existsSync(".changeflow.json") == false) {
      console.log(
        chalk.redBright.bold("[ERROR]"),
        "—",
        chalk.bold(
          '".changeflow.json" file does not exist in the current directory.'
        )
      );
      process.exit(1);
    }

    if (fs.readFileSync(".changeflow.json").toString() == "") {
      console.log(
        chalk.redBright.bold("[ERROR]"),
        "—",
        chalk.bold(
          '".changeflow.json" file is empty, delete it and initialise project before creating changelog.'
        )
      );
    }

    const config = require(`${process.cwd()}/.changeflow.json`);

    const data = await getProjectData(
      config.project.slug,
      config.userID,
      config.key
    );
    // console.log(data.project)
    if (data.success == false) {
      console.log(
        chalk.redBright.bold("[ERROR]"),
        "—",
        chalk.bold(data.message)
      );
    }

    const projectInfo = `
  ╭───────────────────────────────────────────────╮
    ${chalk.blue("Name")}: ${chalk.magenta.bold(data.project.name)}
    ${chalk.blue("Slug")}: ${chalk.magenta.bold(data.project.slug)}
    ${chalk.blue("ID")}: ${chalk.magenta.bold(data.project.id)}
    ${chalk.blue("Description")}: ${chalk.magenta.bold(
      data.project.description
    )}
    ${chalk.blue("Visibility")}: ${chalk.magenta.bold(
      data.project.public ? "Yes" : "No"
    )}
    ${chalk.blue("Created on")}: ${chalk.magenta.bold(
      new Date(data.project.created).toLocaleDateString()
    )}
    ${chalk.blue("Last edited")}: ${chalk.magenta.bold(
      new Date(data.project.last_edited).toLocaleDateString()
    )}
  ╰───────────────────────────────────────────────╯
    `;

    console.log(projectInfo);
    process.exit();
  } catch (e) {
    console.log(chalk.redBright.bold("An internal error has occured", e));
    process.exit(1);
  }
};
