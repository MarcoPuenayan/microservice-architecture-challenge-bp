const fs = require("fs-extra");
const concat = require("concat");
const optimus = require("../optimus.json");
const path = require("path");
const dirname = path.resolve();
build = async () => {
  const name = optimus.git && optimus.git.length ? optimus.git + "/" : "/";
  const files = [];
  files.push(`${dirname}/dist/${name}polyfills.js`);
  files.push(`${dirname}/dist/${name}main.js`);

  await concat(files, `${dirname}/dist/${name}remoteEntryComponent.js`);
};
build();
