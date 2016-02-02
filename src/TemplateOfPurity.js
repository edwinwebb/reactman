/**
* TemplateOfPurity
*
* Reactmans' trusty Template Engine. 100% purity.
*/

"use strict";

/*eslint-env node */

var tmpl = require("blueimp-tmpl").tmpl;
var VoiceOfTruth = require("./VoiceOfTruth");

/**
 * Check that there is something to template.
 *
 * @param  {string} str String to check
 * @return {bool}       Template str present
 */
function checkValidSource(str) {
  return str.indexOf("{%") > -1;
}

/**
 * Render a Blueimp Template
 *
 * @param  {string} source Blueimp Template
 * @param  {object} data   Populating data
 * @return {string}        Rendered Template
 */
function renderToString(source, data) {
  var templateableSource = checkValidSource(source);
  var outputString = templateableSource ? tmpl(source, data) : source;

  if(outputString.length === 0) {
    VoiceOfTruth.error("Bad template");
  } else {
    return outputString;
  }
}

module.exports = renderToString;
