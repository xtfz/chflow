const {Command, Option} = require("commander");
const figlet = require("figlet");
const chalk = require("chalk");
const center = require("center-align");

// Commands
const commands = {
  init: require("../commands/init"),
  disconnect: require("../commands/disconnect"),
  connection: require("../commands/connection"),
  changelogs: require("../commands/changelogs"),
  create: require("../commands/create"),
};

const program = new Command();

let banner = figlet.textSync("ChangeFlow");
let tag = `By ${chalk.blue("XTFZ")} • Author: ${chalk.magenta.bold("Pratik")}`;
let bannerText = `
 ╔════════════════════════════════════════════════════════════╗

${chalk.magenta.bold(banner)}

   ${center(chalk.yellow.bold("The only Changelog Manager you need!"), 70)}
   ${center(tag, 80)}

   ${center(chalk.magenta.bold("https://changeflow.xtfz.xyz/cli"), 70)}

 ╚════════════════════════════════════════════════════════════╝

  `;
let endText = `\n${chalk.blue("For documentation visit:")} ${chalk.magenta.bold(
  "https://changeflow.xtfz.xyz/cli/docs"
)}\n`;

program
  .name("chflow")
  .description(
    "ChangeFlow CLI — Manage your ChangeFlow project changelogs from your terminal!"
  )
  .version("0.0.1");

program.addHelpText("before", bannerText);
// program.addHelpText("afterAll", endText);

// Commands here cuz too lazy for handler

program
  .command("init")
  .description("Setup new ChangeFlow Project or connect to an existing one")
  .action(commands.init);

program
  .command("disconnect")
  .description("Disconnect from currect connected project")
  .action(commands.disconnect);

program
  .command("connection")
  .description("Get connected project information")
  .action(commands.connection);

program
  .command("changelogs")
  .description("Display previous changelogs in a tabular form")
  .option(
    "-m, --max <number>",
    "Set the maximum number of changelogs to display",
    "10"
  )
  .addOption(
    new Option("-s, --sort <sorted data>", "How the data should be sorted")
      .choices(["latest_first", "oldest_first"])
      .default("latest_first")
  )
  .action(commands.changelogs);

program
  .command("create")
  .description("Create a changelog")
  .action(commands.create);

// ===========

program.parse(process.argv);
