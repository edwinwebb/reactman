/**
 * This is a bit of a cluserfuck as I work out what the best way to configure
 * this little fella.
 */

// Load Deps
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var chalk = require('chalk');
var args = process.argv;
var configLocation = false;
var config;

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
 * Render a HB template
 */
function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

/**
 * STOUT an Error Message
 * @param  {string} msg error mesasge
 * @return {string} new folder
 */
function writeError(msg) {
    process.stdout.write(chalk.red("Fatal Error: " + msg + "\n"));
}

/**
 * Make the component directory
 */
function makeFolder(dir) {
  var parent = config.outputFolder;
  var child = dir;
  var folder = parent + child;

  // Is it a directory?
  fs.mkdirSync(folder, 0777, function(err) {
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
      var source = data.toString();
      // call the render function
      var content = renderToString(source, results);
      // write
      fs.writeFileSync(output,content);
      // log success
      process.stdout.write(chalk.green("Wrote :" + output + "\n"));
    } else {
      writeError('File read error');
      process.exit(1);
    }
  });
}

// scrape for config
// @todo - work out how to do this properly
process.argv.forEach(function(val, index, array) {
  if(val === "-c" && array[index+1]) {
    configLocation = path.normalize(array[index+1]);
  }
});

// set config
if(configLocation) {
  config = require(configLocation);
} else {
  config = require('./default_config.json');
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

   // Check folder is good
   makeFolder(result.exports.toLowerCase());

   // Just for components
   writeTemplate(config.templatesFolder + config.templates.component.src, result, config.outputFolder + result.exports.toLowerCase() + "/" + result.exports.toLowerCase());
   writeTemplate(config.templatesFolder + config.templates.component.style, result, config.outputFolder + result.exports.toLowerCase() + "/" + result.exports.toLowerCase());
   writeTemplate(config.templatesFolder + config.templates.component.test, result, config.testsFolder + result.exports.toLowerCase());

 });
