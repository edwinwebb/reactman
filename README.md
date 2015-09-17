REACTMAN
========
Reactman is a CLI code generation tool which will take multiple templates,
populate them via the command line prompt script, and then move them into your
codebase.

Reactman's mission is to increase productivity and have your teams codebase
look like it was authored by one heroic developer.

Reactman works alone, he doesn't need a global install and works on the
command line with NPM scripts.

Reactman away!

BREAKING CHANGES in V3
----------------------
Reactman has upgraded his trusty tools to bring the community more power to
control both input and output. Reactman's mission is to prove to the world that
he has what it takes to get the job done.

* V3 has updated to the Inquirer engine. In your config, change all `description`
keys to `message` and `string` to `input`

* V3 had updated the templating engine to Blueimp Templates, the template
delimiters are now `{%=` and `%}` and logicfull.

RECENT UPDATES
--------------
Exporting the config as a module allows validation and filtering of prompts.

More complex examples in tests. List, choice, checkbox are all exampled.

Changed Handlebars to Blueimp (breaking change), allows for more
flexibility in output.

Changed prompting engine from Prompt to Inquirer (breaking change), allows
more options for populating your templates.

EXAMPLE
-------

Multiple Blueimp templates are taken as the input. A more in depth example is
discussed in the configuration and demoed in the tests.

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

Reactman then prompts the user with a configurable script

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

INSTALL AND USE
---------------

Install via NPM

`npm install --save-dev reactman`

Then add this line to your NPM scripts

`
"reactman" : "reactman --config path-to-config.json"
`

Make a config file from the example below. You will also need some templates.
You can grab the example templates from ./test/templates

Then finally type at your prompt to create a new component from your templates

`
npm run reactman
`

The first prompt will ask for the key in the scripts part of the config.

CONFIG
------
Reactman needs a configuration to run. Optional keys are marked with a *

You can also export an object form a js file, this allows you to use validation
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
directory. The {%=o.ext%} key is populated from the source file extension.
* * script : An array of prompts. See https://github.com/sboudrias/Inquirer.js for
more information.

Example config (used in the Reactman tests)

```json
{
  "templatesFolder" : "./test/templates/",
  "outputFolder" : "./test/output/",
  "issue_tracker" : "https://github.com/edwinwebb/reactman/issues/",
  "scripts" : {
    "component" : {
      "files" : {
        "template.jsx" : "components/{%=o.exportsLowerCase%}/{%=o.exports%}{%=o.ext%}",
        "template.css" : "components/{%=o.exportsLowerCase%}/{%=o.exports%}{%=o.ext%}",
        "template-test.js" : "tests/{%=o.exportsLowerCase%}-test.custom"
      },
      "script" : [{
        "name": "exports",
        "message": "Exports",
        "required": true,
        "default": "Exports",
        "type": "string"
      }, {
        "name": "extends",
        "message": "Extends",
        "default": "Extends",
        "required": true,
        "type": "string"
      }, {
        "name": "description",
        "message": "Description",
        "default": "A react component",
        "required": true,
        "type": "string"
      }, {
        "name": "ticket",
        "message": "Tracking ID",
        "default": "JIRA-####",
        "required": false,
        "type": "string"
      }]
    }
  }
}

```

TEMPLATES
------
Template variables are defined in the `scripts` in your config file. Each value
is also converted to LowerCase and it's slug.

eg : exports => exportsLowerCase
eg : exports => exportsSlug

ROADMAP
-------
* [DONE] Useable for React Components
* [SKIPPED] Flux/Reflux Templating & better config
* [DONE] Custom Scripts
* [DONE] Better testing, break out code to modules
* [In Progress] General improvements to scripts and configs, more control of input & output
* ES6 in templates
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
