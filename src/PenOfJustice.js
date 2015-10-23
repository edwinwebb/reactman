/**
 * PenOfJustice
 *
 * Reactmans' faithful file writer. It's a pen. It's just.
 *
 * Reads, templates, and then writes a file.
 *
 * @todo Should the Pen use the VoiceOfTurth? Probably not. Pass errors in callbacks? Promises?
 *
 */

"use strict";

/*eslint-env node */

var fs = require("fs");
var path = require("path");
var VoiceOfTruth = require("./VoiceOfTruth");
var renderToString = require("./TemplateOfPurity");
var async = require("async");

/**
 * Write a file to the system then calls mainCallback
 *
 * @exports {function}  writeTemplate
 *
 * @param  {string} source       File source
 * @param  {object} results      Prompt results
 * @param  {string} outputFolder
 * @param  {string} outputFile   fileName
 * @param  {func}   callback
 * @return {bool}                Success
 */
function writeTemplate(source, results, outputFolder, outputFile, mainCallback) {

  var output = path.resolve(process.cwd(), outputFolder + outputFile);  // output folder and file
  var input = path.resolve(process.cwd(), source); // template file

  async.waterfall([
    function readFile(callback) {
      fs.readFile(input, function(err, data){
        // make the buffer into a string
        var fileString = data.toString();
        // call the render function
        var content = renderToString(fileString, results);

        VoiceOfTruth.log("Read: " + input);

        callback(err, content);
      });
    },
    function writeFile(content, callback) {
      fs.writeFile(output, content, function(err) {
        if(!err) {
          VoiceOfTruth.log("Wrote: " + output);
        } else {
          VoiceOfTruth.error("File write error: " + output);
        }
        callback(err);
      });
    }
  ], mainCallback);
}

/**
 * Makes a folder on the filesystem
 * warn if exisits, log if made
 *
 * @exports {function}  makeFolder
 *
 * @param  {string}     dir directory path
 * @param  {function}   callback(success, error)
 * @return {null}
 */
function makeFolder(dir, callback) {

  var folder = path.resolve(process.cwd(), dir);
  var noDirErr = "Directory creation problem, check config.json outputFolder";

  fs.mkdir(folder, function(err) {
    if (err && err.code === "EEXIST") {
      VoiceOfTruth.warn(dir + " already exists");
      callback(null, true);
    } else if(err) {
      VoiceOfTruth.error(noDirErr);
      callback(new Error(noDirErr));
    } else {
      VoiceOfTruth.log("Made: " + dir);
      callback(null, true);
    }
  });
}

module.exports = {
  writeTemplate: writeTemplate,
  makeFolder: makeFolder
};
