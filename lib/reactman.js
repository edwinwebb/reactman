// Load Deps
var handlebars = require('handlebars');
var fs = require('fs');
var prompt = require('prompt');
var chalk = require('chalk');

// Load Conf
var config = require('../.reactman');

// Prompt Script
var script = [{
      name: 'exports',
      description: 'Exports',
      required: true,
      default : 'EXPORTS',
      type: 'string'
    },{
      name: 'extends',
      description: 'Extends',
      default : 'EXTENDS',
      required: true,
      type: 'string'
    },{
      name: 'description',
      description: 'Description',
      default : 'A react component',
      required: true,
      type: 'string'
    },{
      name: 'ticket',
      description: 'Tracking ID',
      default : 'TRACK',
      required: false,
      type: 'string'
    }];

/**
 * Render a react template
 */
function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

/**
 * Read a template
 * @param  {object} results prompt IO
 * @return {string}         template
 */
function readTemplates(results) {
  fs.readFile('./templates/template.jsx', function(err, data){
    if (!err) {
      // make the buffer into a string
      var source = data.toString();
      // call the render function
      var temp = renderToString(source, results);
      var folder = makeFolder(results.exports.toLowerCase());
      var fileName = results.exports.toLowerCase() + ".jsx";
      // now it's either callbacks or promises
    } else {
      writeError('File read error');
      process.exit(1);
    }
  });
}

/**
 * STOUT an Error Message
 * @param  {string} msg error mesasge
 * @return {string} new folder
 */
function writeError(msg) {
    process.stdout.write(chalk.red("Fatal Error: " + msg + "\n"));
}

function makeFolder(dir) {
  var parent = config.outputFolder;
  var child = dir;
  var folder = parent + child;

  // Is it a directory?
  fs.mkdir(folder, 0777, function(err) {
    if (err && err.code == 'EEXIST') {
      writeError('Directory exists, exiting...');
      process.exit(1);
    } else if(err) {
      writeError('Check config outputFolder: ' + config.outputFolder);
      process.exit(1);
    } else {
      // successfully created folder
      process.stdout.write(chalk.green("Made: " + dir + "\n"));
    }
  });
}

function writeTemplates(source, dest, name) {
  var output = dest + name;
  console.log(output);
  process.exit(0);
  return;
  // write
  fs.writeFile(output, source, function(err, data){
    if (!err) {
      // make the buffer into a string
      process.stdout.write(chalk.green("Wrote: " + output + "\n"));
      process.exit(0);
    } else {
      writeError('File write error');
      process.exit(1);
    }
  });
}

// START IO

process.stdout.write(chalk.blue("Reactman Away!\n"));
process.stdout.write(chalk.blue("--------------\n"));

prompt.message = "Component".blue;
prompt.delimiter = ":".green;
prompt.start();

//prompt.message('Template a new React Component');

prompt.get(script, function (err, result) {

   if(err) {
     process.exit(1);
   }
   //
   // Log the results.
   //
   console.log('Command-line input received:');
   console.log('  exports: ' + result.exports);
   console.log('  extends: ' + result.extends);
   console.log('  description: ' + result.description);
   console.log('  ticket: ' + result.ticket);

   // Begin file read and write
   makeFolder(result.exports.toLowerCase());
 });
