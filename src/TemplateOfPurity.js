/**
* TemplateOfPurity
*
* Reactmans' trusty Template Engine. 100% purity.
*/

"use strict";

/*eslint-env node */

var tmpl = require("blueimp-tmpl").tmpl;
var writeMessage = require("./PenOfJustice");

/**
 * Render a Handlebars Template
 *
 * @param  {string} source Handlebars Template
 * @param  {object} data   Populating data
 * @return {string}        Rendered Template
 */
function renderToString(source, data) {
  //var template = tmpl.compile(source);
  var outputString = tmpl(source, data);

  if(outputString.length === 0) {
    writeMessage.error("Bad template");
  } else {
    return outputString;
  }
}

module.exports = renderToString;
