#!/usr/bin/env node

"use strict";

/*eslint-env node */

// Load Deps
var path = require("path");
var minimist = require("minimist");
var prompt = require("inquirer");
var slug = require("slug");
var async = require("async");
var VoiceOfTruth = require("../src/VoiceOfTruth");
var PenOfJustice = require("../src/PenOfJustice");
var renderTemplateToString = require("../src/TemplateOfPurity");
var args = minimist(process.argv.slice(2));
var fileFolderExp = new RegExp("^(.*/)([^/]*)$");

// The following functions are tasks for async.waterfall
// @see https://github.com/caolan/async#waterfall

/**
 * Check that user has passed in config arg and `require` the file
 * @param  {Function} callback async waterfall callback
 * @return {[type]}
 */
function loadConfig(callback) {
  if(!args.config) {
    callback(new Error("Please supply a config file."));
    return;
  }

  callback(null, require(path.resolve(process.cwd(), args.config)));
}

/**
 * Check that the user has a valid config and modify it
 *
 * @param  {object}   config   Reactman config
 * @param  {Function} callback async waterfall callback
 * @return {[type]}
 */
function checkScripts(config, callback) {

  var baseScript = {
    "name": "script",
    "message": "Choose a Script from your config.",
    "required": true,
    "type": "list"
  };

  if(!config.scripts) {
    callback(new Error("Please supply a set of prompt scripts in your config."));
  } else {
    baseScript.choices = Object.keys(config.scripts);
    baseScript.default = config.default_script || 0;
    callback(null, baseScript, config);
  }
}

/**
 * Prompt the user with the baseScript found in checkScripts and check it
 *
 * @param  {object}   baseScript   from checkScripts
 * @param  {object}   config       Reactman config
 * @param  {Function} callback     async waterfall callback
 * @return null
 */
function promptBaseScript(baseScript, config, callback){
  prompt.prompt(baseScript, function (result) {
    if(!config.scripts[result.script]) {
      callback(new Error("Script " + result.script + " not found in config."));
    } else {
      callback(null, config.scripts[result.script], config);
    }
  });
}

/**
 * Prompts user with script chosen from config, adds some new keys to
 * the result of the chosen script.
 *
 * @param  {object}   chosenScript from config
 * @param  {object}   config       full config
 * @param  {Function} callback     async waterfall callback
 * @return null
 */
function runChosenScript(chosenScript, config, callback) {
  var script = chosenScript.script;
  var files = chosenScript.files;

  prompt.prompt(script, function (result) {
    // loop results and make each value lowerCase and slug
    for(var res in result) {
      if (result.hasOwnProperty(res) && typeof result[res] === "string") {
        result[res + "LowerCase"] = result[res].toLowerCase();
        result[res + "Slug"] = slug(result[res]);
      }
    }

    // merge ticket numbers and url if defined
    if(result.ticket && config.issue_tracker) {
      result.ticketLink = config.issue_tracker + result.ticket;
    } else if(result.ticket && !config.issue_tracker) {
      result.ticketLink = result.ticket;
      VoiceOfTruth.warn("Ticket link found but no issue_tracker in config");
    }

    if(files) {
      callback(null, files, result, config);
    } else {
      callback(new Error("No files found in selected script."));
    }
  });
}

/**
 * Loop over output files as defined in config. Make folders after
 * templating them.
 *
 * @param  {array}    files    Array of files to output
 * @param  {object}   result   chosen script results
 * @param  {object}   config   full config
 * @param  {Function} callback async waterfall callback
 * @return null
 */
function makeFolders(files, result, config, callback) {

  async.each(files, function(file, asCallback) {
    var folder = fileFolderExp.exec(file)[1];

    folder = config.outputFolder + renderTemplateToString(folder, result);

    PenOfJustice.makeFolder(folder, asCallback);

  }, function(err) {
    callback(err, files, result, config);
  });
}

/**
 * Loop over output files as defined in config. Template filename
 * and write it's templated contents to the fs.
 *
 * @param  {array}    files    Array of files to output
 * @param  {object}   result   chosen script results
 * @param  {object}   config   full config
 * @param  {Function} callback async waterfall callback
 * @return null
 */
function writeFiles(files, result, config, callback) {
  async.forEachOf(files, function(file, key, asCallback) {

    var folder = fileFolderExp.exec(file)[1];
    var fileName = fileFolderExp.exec(file)[2];

    // render file extension, folder, and file names
    folder = config.outputFolder + renderTemplateToString(folder, result);
    fileName = renderTemplateToString(fileName, result);

    // write the template to the filesystem
    PenOfJustice.writeTemplate(
      config.templatesFolder + key,
      result,
      folder,
      fileName,
      asCallback
    );
  }, callback);
}

var tasks = [loadConfig, checkScripts, promptBaseScript, runChosenScript, makeFolders, writeFiles];

// Show the intro text
VoiceOfTruth.intro();

// Start the waterfall
async.waterfall(tasks, function done(err) {
    if(!err) {
      VoiceOfTruth.log("All done, Reactman Away!");
    } else {
      VoiceOfTruth.warn(err.message);
      VoiceOfTruth.log(err.stack);
      VoiceOfTruth.error("Error, R.I.P Reactman");
    }
  }
);
