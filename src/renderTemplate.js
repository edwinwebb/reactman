/**
 * Template Engine
 */

 "use strict";

 /*eslint-env node */

 var handlebars = require("handlebars");
 var writeMessage = require("../src/writeMessage");

 /**
  * Render a HB template
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
