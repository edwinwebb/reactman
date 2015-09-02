"use strict";

/*eslint-env node */

var fs = require("fs");
var path = require("path");
var writeMessage = require("./VoiceOfTruth");
var renderToString = require("./TemplateOfPurity");

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
          writeMessage.log("Wrote: " + output);
        } else {
          writeMessage.error("File write error");
        }
      });

    } else {
      writeMessage.error("File read error :" + input);
    }
  });
}

module.exports = writeTemplate;
