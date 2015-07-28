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
var configLocation = false;
var config;

// Prompt Script
var script = [{
      name: "exports",
      description: "Exports",
      required: true,
      default: "Exports",
      type: "string"
    }, {
      name: "extends",
      description: "Extends",
      default: "Extends",
      required: true,
      type: "string"
    }, {
      name: "description",
      description: "Description",
      default: "A react component",
      required: true,
      type: "string"
    }, {
      name: "ticket",
      description: "Tracking ID",
      default: "JIRA-####",
      required: false,
      type: "string"
    }
];

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
  var parent = config.outputFolder;
  var child = dir;
  var folder = parent + child;

  // Is it a directory?
  fs.mkdirSync(folder, function(err) {
    if (err && err.code === "EEXIST") {
      writeError("Directory exists, exiting...");
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
  var output = path.normalize(outputFolder + ext);  // output and extension
  var input = path.normalize(source); // template file

  // read
  fs.readFile(input, function(err, data){
    if (!err) {
      // make the buffer into a string
      var fileString = data.toString();
      // call the render function
      var content = renderToString(fileString, results);
      // write
      fs.writeFile(output, content, function(err) {
        if(!err) {
          process.stdout.write(chalk.green("Wrote: " + output + "\n"));
        } else {
          writeError("File write error");
        }
      });

    } else {
      writeError("File read error");
    }
  });
}

// scrape for config
// @todo - work out how to do this properly
if(args.config) {
  configLocation = args.config;
}

// set config
if(configLocation) {
  config = require(configLocation);
} else {
  config = require("../default_config.json");
}

// START IO
process.stdout.write(chalk.blue("Reactman Away!\n"));
process.stdout.write(chalk.blue("Template a new react component\n"));
process.stdout.write(chalk.blue("------------------------------\n"));

prompt.message = "Component".blue;
prompt.delimiter = ":".green;
prompt.start();

// Run script
prompt.get(script, function (err, result) {

  if(err) {
    writeError("Prompt error");
  }

  // transform script results
  result.exportsLowerCase = result.exports.toLowerCase();
  result.ticketLink = config.issue_tracker + result.ticket;

  // Check folder is good and create
  makeFolder(result.exportsLowerCase);

  // Just for components at the moment
  writeTemplate(config.templatesFolder + config.templates.component.src, result, config.outputFolder + result.exportsLowerCase + "/" + result.exportsLowerCase);
  writeTemplate(config.templatesFolder + config.templates.component.style, result, config.outputFolder + result.exportsLowerCase + "/" + result.exportsLowerCase);
  writeTemplate(config.templatesFolder + config.templates.component.test, result, config.testsFolder + result.exportsLowerCase);

});
