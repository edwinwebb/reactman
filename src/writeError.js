"use strict";

/*eslint-env node */

var chalk = require("chalk");

/**
 * STOUT an Error Message
 * @param  {string} msg error mesasge
 * @return {null}
 */
function writeError(msg) {
  process.stdout.write(chalk.red("Fatal Error: " + msg + "\n"));
  throw new Error(msg);
}

module.exports.writeError = writeError;
