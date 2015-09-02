/**
* TemplateOfPurity
*
* Reactmans' trusty Template Engine. 100% purity.
*/

"use strict";

/*eslint-env node */

var handlebars = require("handlebars");
var writeMessage = require("./PenOfJustice");

/**
 * Render a Handlebars Template
 *
 * @param  {string} source Handlebars Template
 * @param  {object} data   Populating data
 * @return {string}        Rendered Template
 */
function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);

  if(outputString.length === 0) {
    writeMessage.error("Bad template");
  } else {
    return outputString;
  }
}

module.exports = renderToString;
