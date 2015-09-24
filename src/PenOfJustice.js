/**
 * PenOfJustice
 *
 * Reactmans' faithful file writer. It's a pen. It's just.
 *
 * Reads, templates and then writes a file.
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

/**
 * Write a file to the system
 *
 * @exports {function}  writeTemplate
 *
 * @param  {string} source       File source
 * @param  {object} results      Prompt results
 * @param  {string} outputFolder
 * @param  {string} outputFile   fileName
 * @return {bool}                Success
 */
function writeTemplate(source, results, outputFolder, outputFile, callback) {

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
        if(callback) {
          callback(werr);
        }

        if(!werr) {
          VoiceOfTruth.log("Wrote: " + output);
        } else {
          VoiceOfTruth.error("File write error");
        }

        return true;
      });

    } else {
      VoiceOfTruth.error("File read error :" + input);

      if(callback) {
        callback(false);
      }
      return false;
    }
  });
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

  fs.mkdir(folder, function(err) {
    if (err && err.code === "EEXIST") {
      VoiceOfTruth.warn(dir + " already exists");
    } else if(err) {
      VoiceOfTruth.error("Directory creation problem, check config.json outputFolder");
      if(callback) {
        callback(false, err);
      }
    } else {
      // successfully created folder
      VoiceOfTruth.log("Made: " + dir);
      if(callback) {
        callback(true, null);
      }
    }
  });
}

module.exports = {
  writeTemplate: writeTemplate,
  makeFolder: makeFolder
};
