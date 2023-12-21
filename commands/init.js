const chalk = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");
const getUserData = require("../utils/getUserData");

function saveDataFile(data) {
  const stringify = JSON.stringify(data, null, 4);
  // console.log(stringify)

  fs.writeFileSync(".changeflow.json", stringify);
}

module.exports = async () => {
  try {
    if (fs.existsSync(".changeflow.json")) {
      console.log(
        chalk.redBright.bold(
          '\n[ERROR] — ".changeflow.json" file already exists in the directory! Delete the existing file and run the command gain.'
        )
      );
      process.exit(1);
    }

    let data = {
      CLI_KEY: "",
      username: "",
      userID: "",
      userslug: "",
      key: "",
      project: {
        name: "",
        slug: "",
        id: "",
      },
    };

    console.log(chalk.blue("\nStarting initialisation...\n"));

    // stage 1 — user login prompts
    const prompts = [
      {
        name: "CLI_KEY",
        message: "Enter your secret CLI Key:",
      },
    ];

    // stage 2 — method prompt
    const methodPrompt = [
      {
        name: "init_method",
        type: "list",
        message: "What do you want to do?",
        choices: [
          {
            name: "Create a new Project on ChangeFlow",
            short: "Create a new project",
          },
          {
            name: "Connect to an existing Project on ChangeFlow",
            short: "Connect to an existing Project",
          },
        ],
      },
    ];

    // stage 3 — create project prompts
    const projectPrompts = [
      {
        name: "name",
        message: "Enter project name:",
      },
      {
        name: "slug",
        message: "Enter project slug (example: test-project):",
        validate: (input) => {
          if (typeof input !== "string" || input.includes(" ")) {
            return "Slug must be a valid string with no spaces";
          }
          return true;
        },
      },
      {
        name: "description",
        message: "Enter project description:",
      },
      {
        name: "visbility",
        type: "list",
        message: "Set Visibility for other users:",
        choices: ["Public", "Private"],
      },
    ];

    const ans = await inquirer.prompt(prompts);
    const userData = await getUserData(ans.CLI_KEY);
    // console.log(userData)

    if (userData.success == false && userData.code == 404) {
      console.log(
        chalk.redBright.bold("\n[ERROR]"),
        `—`,
        chalk.bold("User not found.")
      );
      process.exit(1);
    }

    console.log(
      chalk.greenBright.bold("[✓]"),
      chalk.bold("Logging as"),
      `${chalk.redBright.bold(userData.user.name)}${chalk.bold("...\n")}`
    );

    data.CLI_KEY = userData.user.cli_key;
    data.username = userData.user.name;
    data.userID = userData.user.id;
    data.userslug = userData.user.userslug;
    data.key = userData.user.key;

    const methodAns = await inquirer.prompt(methodPrompt);

    const allProjectsPrompt = [
      {
        type: "list",
        name: "selected_project",
        message: "Select the project you want to connect with:",
        choices: [],
      },
    ];

    if (
      methodAns.init_method == "Connect to an existing Project on ChangeFlow"
    ) {
      userData.user.projects.forEach((value) => {
        allProjectsPrompt[0].choices.push({
          name: chalk.magenta.bold(` ${value.slug} `),
        });
      });

      const selectedProject = await inquirer.prompt(allProjectsPrompt);
      const selectedProjectSlug =
        selectedProject.selected_project.split(" ")[1];
      const selectedProjectData = userData.user.projects.find(
        (v) => v.slug == selectedProjectSlug
      );

      data.project.name = selectedProjectData.name;
      data.project.slug = selectedProjectData.slug;
      data.project.id = selectedProjectData.id;

      console.log(
        chalk.greenBright.bold("\n[✓]"),
        chalk.bold("Saving data in"),
        chalk.magenta.bold(".changeflow.json"),
        chalk.bold("...\n")
      );
      saveDataFile(data);
    } else {
      const createProjectAns = await inquirer.prompt(projectPrompts);
      // console.log(createProjectAns)

      const reqData = {
        id: userData.user.id,
        key: userData.user.key,
        name: createProjectAns.name,
        slug: createProjectAns.slug,
        description: createProjectAns.description,
        is_public: createProjectAns.visbility == "Public" ? true : false,
      };

      const r = await fetch("https://api.changeflow.xtfz.xyz/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const response = await r.json();

      if (response.success == false) {
        console.log(
          chalk.redBright.bold("[ERROR]"),
          "—",
          chalk.bold(response.message)
        );
      }
      const createdProjectData = response.project;
      // console.log(createdProjectData)

      console.log(
        chalk.greenBright.bold("\n[✓]"),
        chalk.bold("Project successfully created...")
      );

      data.project.name = createdProjectData.name;
      data.project.slug = createdProjectData.slug;
      data.project.id = createdProjectData.id;

      console.log(
        chalk.greenBright.bold("[✓]"),
        chalk.bold("Saving data in"),
        chalk.magenta.bold(".changeflow.json"),
        chalk.bold("...\n")
      );
      saveDataFile(data);
    }

    console.log(
      chalk.greenBright.bold(
        "Successfully connected to the project.\nYou can use"
      ),
      chalk.magenta.bold("chflow connection"),
      chalk.greenBright.bold("to check the connection or"),
      chalk.magenta.bold("chflow disconnect"),
      chalk.greenBright.bold("to disconnect from project!")
    );
    console.log(chalk.bold("Happy Coding!"));

    process.exit();
  } catch (e) {
    console.log(chalk.redBright.bold("An internal error has occured"), e);
  }
};
