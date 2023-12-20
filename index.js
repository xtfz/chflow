const { Command } = require("commander");
const figlet = require("figlet");
const chalk = require("chalk");
const center = require("center-align");

// Commands
const commands = {
  init: require("./commands/init"),
  disconnect: require("./commands/disconnect"),
  connection: require("./commands/connection"),
};

const program = new Command();

let banner = figlet.textSync("ChangeFlow");
let tag = `By ${chalk.blue("XTFZ")} • Author: ${chalk.magentaBright.bold(
  "Pratik"
)}`;
let bannerText = `
 ╔════════════════════════════════════════════════════════════╗

${chalk.magentaBright.bold(banner)}

   ${center(chalk.red("The only Changelog Manager you need!"), 60)}
   ${center(tag, 80)}

   ${center(chalk.magentaBright.bold("https://changeflow.xtfz.xyz/cli"), 70)}

 ╚════════════════════════════════════════════════════════════╝

  `;
let endText = `\n${chalk.blue(
  "For documentation visit:"
)} ${chalk.magentaBright.bold("https://changeflow.xtfz.xyz/cli/docs")}\n`;

program
  .name("chflow")
  .description(
    "ChangeFlow CLI — Manage your ChangeFlow project changelogs from your terminal!"
  )
  .version("0.0.1");

program.addHelpText("beforeAll", bannerText);
program.addHelpText("afterAll", endText);

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

program.parse(process.argv);
