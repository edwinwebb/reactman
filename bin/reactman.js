#!/usr/bin/env node

"use strict";

/*eslint-env node */

// Load Deps
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var minimist = require("minimist");
var prompt = require("prompt");
var chalk = require("chalk");
var slug = require("slug");
var writeError = require("../src/writeError");
var args = minimist(process.argv.slice(2));
var baseScript = [{
  "name": "script",
  "description": "Choose a Script from your config.",
  "required": true,
  "type": "string"
}];
var config;

/**
 * Render a HB template
 */
function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  if(outputString.length === 0) {
    writeError("Bad template");
  } else {
    return outputString;
  }
}

/**
 * Make the component directory
 */
function makeFolder(dir) {

  var folder = path.resolve(process.cwd(), dir);

  // Make the folder, warn if exisits, log if made
  fs.mkdir(folder, function(err) {
    if (err && err.code === "EEXIST") {
      process.stdout.write(chalk.yellow("Directory exists: " + dir + "\n"));
    } else if(err) {
      writeError("Check config outputFolder: " + config.outputFolder);
    } else {
      // successfully created folder
      process.stdout.write(chalk.green("Made: " + dir + "\n"));
    }
  });
}

/**
 * Write and populate a template to destination
 */
function writeTemplate(source, results, outputFolder, outputFile) {

  var output = path.resolve(process.cwd(), outputFolder + outputFile);  // output folder and file
  var input = path.resolve(process.cwd(), source); // template file

  // read
  fs.readFile(input, function(err, data){
    if (!err) {
      // make the buffer into a string
      var fileString = data.toString();
      // call the render function
      var content = renderToString(fileString, results);
      // write
      fs.writeFile(output, content, function(werr) {
        if(!werr) {
          process.stdout.write(chalk.green("Wrote: " + output + "\n"));
        } else {
          writeError("File write error");
        }
      });

    } else {
      writeError("File read error :" + input);
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
      writeError("Prompt error: " + err);
    }

    // loop results and make each value lowerCase
    for(var res in result) {
      if (result.hasOwnProperty(res)) {
        result[res + "LowerCase"] = result[res].toLowerCase();
        result[res + "Slug"] = slug(result[res]);
      }
    }

    // merge ticket numbers and url if defined
    if(result.ticket) {
      result.ticketLink = config.issue_tracker + result.ticket;
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
          makeFolder(config.outputFolder + renderToString(folder, result));
        }

        // if the filename has a handlebars string then make that folder
        if(fileName.indexOf("{{") > -1) {
          fileName = renderToString(fileName, result);
        } else {
          fileName = result.exportsLowerCase + result.ext;
        }

        // write the template to the filesystem
        writeTemplate(
          config.templatesFolder + file,
          result,
          config.outputFolder + renderToString(folder, result),
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
  writeError("Please supply a config file.");
}

// set script
if(!config.scripts) {
  writeError("Please supply a set of scripts.");
}

// set default script for first prompt
if(config.default_script) {
  baseScript[0].default = config.default_script;
}

// START IO
process.stdout.write(chalk.blue("Reactman Away!\n"));
process.stdout.write(chalk.blue("--------------\n"));

// Start Prompt
prompt.message = "Reactman".green;
prompt.delimiter = " : ".green;
prompt.start();

// Prompt for script to run§
prompt.get(baseScript, function (err, result) {

  if(err) {
    writeError("Prompt error");
  }

  // check and then run script
  if(config.scripts[result.script]) {
    runScript(config.scripts[result.script]);
  } else {
    writeError("Script " + result.script + " not found in config. Exiting.");
  }

});
