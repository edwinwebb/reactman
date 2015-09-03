/**
 * PenOfJustice
 *
 * Reactmans' faithful file writer. It's a pen. It's just.
 *
 */

"use strict";

/*eslint-env node */

var fs = require("fs");
var path = require("path");
var writeMessage = require("./VoiceOfTruth");
var renderToString = require("./TemplateOfPurity");

/**
 * Write a file to the system
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
        if(!werr) {
          writeMessage.log("Wrote: " + output);
        } else {
          writeMessage.error("File write error");
        }
        if(callback) {
          callback(werr);
        }
        return werr;
      });

    } else {
      writeMessage.error("File read error :" + input);

      if(callback) {
        callback(false);
      }
      return false;
    }
  });
}

module.exports = writeTemplate;
