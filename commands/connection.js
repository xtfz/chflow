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
    ${chalk.blue("Name")}: ${chalk.magentaBright.bold(data.project.name)}
    ${chalk.blue("Slug")}: ${chalk.magentaBright.bold(data.project.slug)}
    ${chalk.blue("ID")}: ${chalk.magentaBright.bold(data.project.id)}
    ${chalk.blue("Description")}: ${chalk.magentaBright.bold(
      data.project.description
    )}
    ${chalk.blue("Visibility")}: ${chalk.magentaBright.bold(
      data.project.public ? "Yes" : "No"
    )}
    ${chalk.blue("Created on")}: ${chalk.magentaBright.bold(
      new Date(data.project.created).toLocaleDateString()
    )}
    ${chalk.blue("Last edited")}: ${chalk.magentaBright.bold(
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
