"use strict";

/*eslint-env node */

var chalk = require("chalk");

/**
 * STOUT an Error Message and then Throw it
 *
 * Reactman has failed in his mission, but who is to blame for this lamentable
 * state of affairs?
 *
 * @param  {string} msg error mesasge
 * @return {null}
 * @exports writeError
 */
function writeError(msg) {
  process.stdout.write(chalk.red("Fatal Error: " + msg + "\n"));
  throw new Error(msg);
}

function writeLog(msg) {
  process.stdout.write(chalk.green(msg + "\n"));
}

function writeWarning(msg) {
  process.stdout.write("Warning: " + chalk.green(msg + "\n"));
}

function writeIntro() {
  process.stdout.write(chalk.blue("Reactman Away!\n"));
  process.stdout.write(chalk.blue("--------------\n"));
}

module.exports.writeMessage = {
  error: writeError,
  log: writeLog,
  warn: writeWarning,
  intro: writeIntro
};
