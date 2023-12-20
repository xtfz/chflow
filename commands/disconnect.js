const chalk = require("chalk");
const fs = require("fs");

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
    fs.unlinkSync(".changeflow.json");
    console.log(
      chalk.greenBright.bold("[✓]"),
      chalk.bold("Succesfully deleted file"),
      chalk.magentaBright.bold(".changeflow.json")
    );
  } catch (e) {
    console.log(chalk.redBright.bold("An internal error has occured", e));
    process.exit(1);
  }
};
