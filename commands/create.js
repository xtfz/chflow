const chalk = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");

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

    const {
      userID,
      key,
      project,
    } = require(`${process.cwd()}/.changeflow.json`);

    const prompts = [
      {
        type: "input",
        message: "Title of the changelog:",
        name: "title",
      },
      {
        type: "input",
        message: "Version: (in x.y.z format)",
        name: "version",
        validate: (input) => {
          const splitted = input.split(".");
          if (
            splitted.length != 3 ||
            isNaN(parseInt(splitted[0])) ||
            isNaN(parseInt(splitted[1])) ||
            isNaN(parseInt(splitted[2]))
          ) {
            return "Version must be in  x.y.z format where x, y and z are numbers!";
          }
          return true;
        },
      },
      {
        type: "editor",
        message: "Body of the changelog: (markdown or text)",
        name: "body",
        postfix: ".md",
      },
      {
        type: "confirm",
        message: "is it in Beta stage?",
        name: "beta",
      },
    ];

    const ans = await inquirer.prompt(prompts);
    // console.log(ans)

    const body = {
      id: userID,
      key,
      slug: project.slug,
      title: ans.title,
      body: ans.body,
      version: ans.version,
      beta: ans.beta,
    };

    const r = await fetch("https://api.changeflow.xtfz.xyz/changelogs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const response = await r.json().catch((e) => e);

    if (!response || response.success == false) {
      console.log(
        chalk.redBright.bold("\n[ERROR]"),
        "—",
        chalk.bold(response.message || "Internal server error")
      );
      process.exit(1);
    } else {
      console.log(
        chalk.greenBright.bold("\n[✓]"),
        chalk.bold("Changelog has been created with ID"),
        chalk.magenta.bold(response.changelog.id),
        chalk.bold("\nURL:"),
        chalk.magenta.bold(
          `https://changeflow.xtfz.xyz/projects/${response.changelog.project.slug}/changelogs/${response.changelog.version}`
        )
      );
      process.exit();
    }
  } catch (e) {
    console.log(chalk.redBright.bold("An internal error has occured", e));
    process.exit(1);
  }
};
