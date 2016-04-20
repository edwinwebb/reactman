REACTMAN
========
Reactman is a CLI code generation tool which will take multiple templates,
populate them, and then move them into your codebase.

Reactman's mission is to increase productivity and have your teams codebase
look like it was authored by one heroic developer.

Reactman works alone, he doesn't need a global install and works on the
command line with NPM scripts.

Reactman away!

INSTALL AND USE
---------------

Install via NPM

`npm install --save-dev reactman`

Then add this line to your NPM scripts

`
"reactman" : "reactman --config path-to-config.js"
`

Make a config file from the example below. You will also need some templates.
You can grab the example templates from ./test/templates.

Then finally type at your prompt to create a new component from your templates

`
npm run reactman
`

The first prompt will ask for the key in the scripts part of the config.

BASIC EXAMPLE
-------------

Reactman needs at least two files to get started, a configuration file and a
template. He's designed to use multiple templates and is generally used to
bootstrap a component in a React project. A more in depth example is discussed
in the configuration and demoed in the tests.

Blueimp templates are taken as the input. This will be populated via the prompt
then written to your project.

```javascript
import React from "react";

/**
 * {%=o.description%}
 *
 * @exports {%=o.exports%}
 * @extends {%=o.extends%}
 */
export default class {%=o.exports%} extends {%=o.extends%} {
  /**
   * @return {ReactElement} {%=o.exports%}
   */
  render() {
    return(<div>{%=o.exports%}</div>)
  }
}
```

Reactman then prompts the user with a configurable script after running a command
like 'npm run reactman'

```json
"script" : [{
  "name": "exports",
  "message": "Exports"
}, {
  "name": "extends",
  "message": "Extends"
}, {
  "name": "description",
  "message": "Description"
}]
```

Reactman will then create a directory if required and write the populated
templates to your codebase.

```javascript
import React from "react";

/**
 * Reactman made this
 *
 * @exports Reactman
 * @extends React.Component
 */
export default class Reactman extends React.Component {
  /**
   * @return {ReactElement} React.Component
   */
  render() {
    return(<div>Reactman</div>)
  }
}
```

You can find more complex examples in my pixi-seed project and in the tests.

TEMPLATES
------
Template variables are defined in the `scripts` in your config file. Each
`type: input` value is also converted to LowerCase and it's Slug.

eg : exports => exportsLowerCase
eg : exports => exportsSlug
eg : exports => exportsCamelCase

in example...

```
This looks like a job for Reactman!
-----------------------------------
? Choose a Script from your config: component
? Exports: Exports Test

...

{%= o.exports %}
{%= o.exportsSlug %}
{%= o.exportsLowerCase %}
{%= o.exportsCamelCase %}

...
Exports Test
Exports_Test
exports_test
exportsTest
```

CONFIG
------
Reactman needs a configuration to run. Optional keys are marked with a *

You can also export an object form a .js file, this allows you to use validation
and filter functions.

See the working example in `./test/` for more information

* `templatesFolder` defines where Reactman will look for templates
* `outputFolder` is prepended to each file write
* `issueTracker`* is prepended to any `ticket` result
* `scripts` defines the templating process
* `default_script` is the default for the first reactman prompt
* * key : Type this at the first prompt to init the script, component in this
example
* * `files` : The files to load for templating
* * * key : the template to load
* * * value : The output directory, also passed the results from the script for
templating. If it has a Blueimp expression Reactman will attempt to make this
directory.
* * script : An array of prompts. See https://github.com/sboudrias/Inquirer.js for
more information.

Example config (used in the Reactman tests)

```javascript
function variableName(i) {
  var exp = /^[a-zA-Z][a-zA-Z0-9]*?$/;
  var pass = exp.test(i);

  if(pass) {
    return true;
  } else {
    return "Invalid variable name, please try again...";
  }
}

function prependJIRA(i) {
  return "JIRA-" + i;
}

module.exports = {
  "templatesFolder" : "./test/templates/",
  "outputFolder" : "./test/output/",
  "issue_tracker" : "https://github.com/edwinwebb/reactman/issues/",
  "default_script" : "component",
  "scripts" : {
    "component" : {
      "files" : {
        "template.jsx" : "components/{%=o.exportsLowerCase%}/{%=o.exports%}-custom.js",
        "template.css" : "components/{%=o.exportsLowerCase%}/{%=o.exports%}-custom.css",
        "template-test.js" : "tests/{%=o.exportsLowerCase%}-test.custom"
      },
      "script" : [{
        "name": "exports",
        "message": "Exports",
        "required": true,
        "default": "Exports",
        "type": "input",
        "validate" : variableName
      }, {
        "name": "extends",
        "message": "Extends",
        "default": "Extends",
        "required": true,
        "type": "input",
        "validate" : variableName
      }, {
        "name": "description",
        "message": "Description",
        "default": "A react component",
        "required": true,
        "type": "input"
      }, {
        "name": "ticket",
        "message": "Tracking ID",
        "default": "123",
        "required": false,
        "type": "input",
        "filter" : prependJIRA
      }, {
        "name": "rootstyle",
        "message": "Root Style Name",
        "default": 1,
        "required": false,
        "type": "list",
        "choices" : ["main", "root", "other"]
      }, {
        "name": "includeprops",
        "message": "Include Props in file?",
        "default": true,
        "required": false,
        "type": "confirm"
      }, {
        "name": "importlist",
        "message": "Choose file includes",
        "default": ["classnames"],
        "required": false,
        "type": "checkbox",
        "choices" : [{
          "name" : "ClassNames",
          "value" : "classnames"
        }, {
          "name" : "PropTypes",
          "value" : "proptypes"
        }, {
          "name" : "PureComponent",
          "value" : "purecomp"
        }]
      }]
    }
  }
}

```

RECENT UPDATES
--------------
Added CamelCase

Exporting the config as a module allows validation and filtering of prompts.

More complex examples in tests. List, choice, checkbox are all exampled.

Changed Handlebars to Blueimp (breaking change), allows for more
flexibility in output.

Changed prompting engine from Prompt to Inquirer (breaking change), allows
more options for populating your templates.

ROADMAP
-------
* [DONE] Useable for React Components
* [SKIPPED] Flux/Reflux Templating & better config
* [DONE] Custom Scripts
* [DONE] Better testing, break out code to modules
* [In Progress] General improvements to scripts and configs, more control of input & output
* Better workflows and examples, eg state commits, update issue trackers
* Cute website & logo
* Repository of templates and scripts

CONTRIBUTING
------------
Reactman is a young buck who has more training to complete. Can the community
support his near-heroic efforts?

TESTS
-----
Run the very limited tests with `npm test` and mash the enter key for a pass.

LICENSE
------
ISC

Copyright (c) 2015, Edwin Webb

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
