const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const bootstrap = require("./bootstrap");
const moduleFederation = require("./module.federation");
const optimus = require("../optimus.json");

const dirname = path.resolve();
async function write(file, content) {
  return await fse.outputFile(file, content);
}

async function readFile(file) {
  return await fs.promises.readFile(file, "utf8");
}

async function converterModule() {
  const bootrapFile = dirname + "/src/bootstrap.ts";
  const webpackFile = dirname + "/webpack.config.js";
  const htmlFile = dirname + "/src/index.html";
  const bt = await readFile(bootrapFile);
  let wb = moduleFederation;
  let html = await readFile(htmlFile);
  wb = wb.replace(/test1/g, optimus.name || "mfe");
  wb = wb.replace(/component1/g, optimus.mfElement || "mfe-element");
  html = html.replace(/app-root/g, optimus.mfElement || "mfe-element");

  await write(bootrapFile, bootstrap);
  await write(webpackFile, wb);
  await write(htmlFile, html);
}
converterModule();
