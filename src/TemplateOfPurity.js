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
 * Render a Blueimp Template
 *
 * @param  {string} source Blueimp Template
 * @param  {object} data   Populating data
 * @return {string}        Rendered Template
 */
function renderToString(source, data) {
  var outputString = tmpl(source, data);

  if(outputString.length === 0) {
    VoiceOfTruth.error("Bad template");
  } else {
    return outputString;
  }
}

module.exports = renderToString;
