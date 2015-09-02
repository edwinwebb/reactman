#!/usr/bin/env node

"use strict";

/*eslint-env node */

// Load Deps
var fs = require("fs");
var path = require("path");
var minimist = require("minimist");
var prompt = require("prompt");
var slug = require("slug");
var VoiceOfTruth = require("../src/VoiceOfTruth");
var writeTemplate = require("../src/PenOfJustice");
var renderTemplateToString = require("../src/TemplateOfPurity");
var args = minimist(process.argv.slice(2));
var baseScript = [{
  "name": "script",
  "description": "Choose a Script from your config.",
  "required": true,
  "type": "string"
}];
var config;



/**
 * Make the component directory
 */
function makeFolder(dir) {

  var folder = path.resolve(process.cwd(), dir);

  // Make the folder, warn if exisits, log if made
  fs.mkdir(folder, function(err) {
    if (err && err.code === "EEXIST") {
      VoiceOfTruth.warn(dir + " already exisits");
    } else if(err) {
      VoiceOfTruth.error("Check config outputFolder: " + config.outputFolder);
    } else {
      // successfully created folder
      VoiceOfTruth.log("Made: " + dir);
    }
  });
}

/**
 * Run the chosen script
 */
function runScript(data) {

  var script = data.script;
  var files = data.files;

  // Run chosen script
  prompt.get(script, function (err, result) {

    var fileFolderExp = new RegExp("^(.*/)([^/]*)$");
    var folder;
    var fileName;

    if(err) {
      VoiceOfTruth.error("Prompt error: " + err);
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
          makeFolder(config.outputFolder + renderTemplateToString(folder, result));
        }

        // if the filename has a handlebars string then make that folder
        if(fileName.indexOf("{{") > -1) {
          fileName = renderTemplateToString(fileName, result);
        } else {
          fileName = result.exportsLowerCase + result.ext;
        }

        // write the template to the filesystem
        writeTemplate(
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

// Start Prompt
prompt.message = "Reactman".green;
prompt.delimiter = " : ".green;
prompt.start();

// Prompt for script to run
prompt.get(baseScript, function (err, result) {

  if(err) {
    VoiceOfTruth.error("Prompt error");
  }

  // check and then run script
  if(config.scripts[result.script]) {
    runScript(config.scripts[result.script]);
  } else {
    VoiceOfTruth.error("Script " + result.script + " not found in config. Exiting.");
  }

});
