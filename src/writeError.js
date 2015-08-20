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

module.exports.writeError = writeError;
