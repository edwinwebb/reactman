#!/usr/bin/env node

"use strict";

/**
 * This is a bit of a cluserfuck as I work out what the best way to configure
 * this little fella.
 */

/*eslint-env node */

// Load Deps
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var minimist = require("minimist");
var prompt = require("prompt");
var chalk = require("chalk");
var args = minimist(process.argv.slice(2));
var baseScript = [{
  "name": "script",
  "description": "Choose a Script from your config.",
  "required": true,
  "default": "component",
  "type": "string"
}];
var config;
//var script;
var currentData;

/**
 * STOUT an Error Message
 * @param  {string} msg error mesasge
 * @return {null}
 */
function writeError(msg) {
  process.stdout.write(chalk.red("Fatal Error: " + msg + "\n"));
  throw new Error(msg);
}


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
function writeTemplate(source, results, outputFolder) {

  var ext = path.extname(source); // file extension
  var output = path.resolve(process.cwd(), outputFolder + ext);  // output and extension
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

    if(err) {
      writeError("Prompt error: " + err);
    }

    // loop results and make each value lowerCase
    for(var res in result) {
      if (result.hasOwnProperty(res)) {
        result[res + "LowerCase"] = result[res].toLowerCase();
      }
    }

    // merge ticket numbers and url if defined
    if(result.ticket) {
      result.ticketLink = config.issue_tracker + result.ticket;
    }

    // Loop over files, create folders if templated and write out output
    for (var file in files) {
      if (files.hasOwnProperty(file)) {

        // if the value has a handlebars string then make that folder
        if(files[file].indexOf('{{') > -1) {
          makeFolder(config.outputFolder + renderToString(files[file], result));
        }

        writeTemplate(
          config.templatesFolder + file,
          result,
          config.outputFolder + renderToString(files[file], result) + "/" + result.exportsLowerCase
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

// START IO
process.stdout.write(chalk.blue("Reactman Away!\n"));
process.stdout.write(chalk.blue("Template a new file\n"));
process.stdout.write(chalk.blue("-------------------\n"));

prompt.message = "Component".blue;
prompt.delimiter = ":".green;
prompt.start();

// Prompt for script to run§
prompt.get(baseScript, function (err, result) {

  if(err) {
    writeError("Prompt error");
  }

  runScript(config.scripts[result.script]);

});
