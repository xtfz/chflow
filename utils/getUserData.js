// const fetch = require("node-fetch-commonjs");

const getUserData = async (CLI_KEY) => {
  const url = "https://api.changeflow.xtfz.xyz/cli/user";
  const key = { cli_key: CLI_KEY };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(key),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return data;
};

module.exports = getUserData;
