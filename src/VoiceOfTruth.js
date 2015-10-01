/**
 * VoiceOfTruth
 *
 * Reactmans' powerful messaging to the prompt.
 *
 */

"use strict";

/*eslint-env node */

var chalk = require("chalk");

/**
 * STOUT an Error Message and then Throw it
 *
 * Reactman has failed in his mission, but who is to blame for this lamentable
 * state of affairs?
 *
 * @param  {string} msg
 * @return {null}
 * @exports writeError
 */
function writeError(msg) {
  process.stdout.write("Error: " + chalk.red(msg + "\n"));
  return msg;
}

/**
 * STOUT a green Log message
 *
 * Sing loud and praise the green text of success
 *
 * @param  {string} msg
 * @return {null}
 * @exports writeLog
 */
function writeLog(msg) {
  process.stdout.write(chalk.green(msg + "\n"));
  return msg;
}

/**
 * STOUT a yellow Warning message
 *
 * Are foes at Reactmans door? Stand fast hero, and perhaps tweak your config.
 *
 * @param  {string} msg
 * @return {null}
 * @exports writeWarning
 */
function writeWarning(msg) {
  process.stdout.write("Warning: " + chalk.yellow(msg + "\n"));
  return msg;
}

/**
 * STOUT a blue message
 *
 * Every hero deserves an entrance
 *
 * @param  {string} msg
 * @return {null}
 * @exports writeintro
 */
function writeIntro() {
  process.stdout.write(chalk.blue("Reactman Away!\n"));
  process.stdout.write(chalk.blue("--------------\n"));
  return true;
}

module.exports = {
  error: writeError,
  log: writeLog,
  warn: writeWarning,
  intro: writeIntro
};
