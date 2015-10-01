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

/**
 * Check that user has passed in config arg and `require` the file
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function loadConfig(callback) {
  if(!args.config) {
    callback(new Error("Please supply a config file."));
    return;
  }

  callback(null, require(path.resolve(process.cwd(), args.config)));
}

/**
 * Check that the user has a valid config
 *
 * @param  {object}   config   Reactman config
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
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
    return;
  } else {
    baseScript.choices = Object.keys(config.scripts);
    baseScript.default = config.default_script || 0;
  }

  callback(null, baseScript, config);
}

/**
 * Prompt the user with the baseScript found in checkScripts and check it
 * @param  {object}   baseScript
 * @param  {object}   config      Reactman config
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
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
 * @param  {[type]}   chosenScript [description]
 * @param  {[type]}   config       [description]
 * @param  {Function} callback     [description]
 * @return {[type]}                [description]
 */
function runChosenScript(chosenScript, config, callback) {
  var script = chosenScript.script;
  var files = chosenScript.files;

  prompt.prompt(script, function (result) {
    // loop results and make each value lowerCase
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

function outputFiles(files, result, config, callback) {
  var fileFolderExp = new RegExp("^(.*/)([^/]*)$");
  var folder;
  var fileName;

  for (var file in files) {
    if (files.hasOwnProperty(file)) {

      // extract folder and filename
      folder = fileFolderExp.exec(files[file])[1];
      fileName = fileFolderExp.exec(files[file])[2];
      result.ext = path.extname(file); // file extension

      // if the folder has a template string then make that folder
      if(folder.indexOf("{%=") > -1) {
        PenOfJustice.makeFolder(config.outputFolder + renderTemplateToString(folder, result));
      }

      // if the filename has a template string then make that folder
      if(fileName.indexOf("{%=") > -1) {
        fileName = renderTemplateToString(fileName, result);
      } else {
        fileName = result.exportsLowerCase + result.ext;
      }

      // write the template to the filesystem
      PenOfJustice.writeTemplate(
        config.templatesFolder + file,
        result,
        config.outputFolder + renderTemplateToString(folder, result),
        fileName
      );
    }
  }

  callback(null);
}

var tasks = [loadConfig, checkScripts, promptBaseScript, runChosenScript, outputFiles];

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
