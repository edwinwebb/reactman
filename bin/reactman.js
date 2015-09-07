#!/usr/bin/env node

"use strict";

/*eslint-env node */

// Load Deps
var path = require("path");
var minimist = require("minimist");
var prompt = require("inquirer");
var slug = require("slug");
var VoiceOfTruth = require("../src/VoiceOfTruth");
var PenOfJustice = require("../src/PenOfJustice");
var renderTemplateToString = require("../src/TemplateOfPurity");
var args = minimist(process.argv.slice(2));
var baseScript = [{
  "name": "script",
  "message": "Choose a Script from your config.",
  "required": true,
  "type": "string"
}];
var config;

/**
 * Run the chosen script
 */
function runScript(data) {

  var script = data.script;
  var files = data.files;

  // Run chosen script
  prompt.prompt(script, function (result) {

    var fileFolderExp = new RegExp("^(.*/)([^/]*)$");
    var folder;
    var fileName;

    if(!result) {
      VoiceOfTruth.error("Prompt error");
    }

    // loop results and make each value lowerCase
    for(var res in result) {
      if (result.hasOwnProperty(res)) {
        result[res + "LowerCase"] = result[res].toLowerCase();
        result[res + "Slug"] = slug(result[res]);
      }
    }

    // merge ticket numbers and url if defined
    if(result.ticket && config.issue_tracker) {
      result.ticketLink = config.issue_tracker + result.ticket;
    } else if(result.ticket && !config.issue_tracker) {
      result.ticketLink = result.ticket;
      VoiceOfTruth.warn("Ticket script found but no issue_tracker in config");
    }

    // Loop over files, create folders if templated and write out output
    for (var file in files) {
      if (files.hasOwnProperty(file)) {

        // extract folder and filename
        folder = fileFolderExp.exec(files[file])[1];
        fileName = fileFolderExp.exec(files[file])[2];
        result.ext = path.extname(file); // file extension

        // if the folder has a handlebars string then make that folder
        if(folder.indexOf("{{") > -1) {
          PenOfJustice.makeFolder(config.outputFolder + renderTemplateToString(folder, result));
        }

        // if the filename has a handlebars string then make that folder
        if(fileName.indexOf("{{") > -1) {
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
  });
}

// set config
if(args.config) {
  config = require(path.resolve(process.cwd(), args.config));
} else {
  VoiceOfTruth.error("Please supply a config file.");
}

// set script
if(!config.scripts) {
  VoiceOfTruth.error("Please supply a set of scripts.");
}

// set default script for first prompt
if(config.default_script) {
  baseScript[0].default = config.default_script;
}

// START IO

// Intro
VoiceOfTruth.intro();

// Prompt for script to run
prompt.prompt(baseScript, function (result) {

  if(!result) {
    VoiceOfTruth.error("Prompt error.");
  }

  // check and then run script
  if(config.scripts[result.script]) {
    runScript(config.scripts[result.script]);
  } else {
    VoiceOfTruth.error("Script " + result.script + " not found in config. Exiting.");
  }

});
