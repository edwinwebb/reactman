REACTMAN
========
Large teams codebases should look like a single person wrote them. Reactman is
here to help and up your productivity. Reactman is a code generation tool which
will take templates and populate them via the command line prompt script and
then move them into your codebase.

Reactman away!

USE
---

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
templating. If it has a handlebars expression Reactman will attempt to make this
directory.
* * script : An array of prompts. See https://github.com/flatiron/prompt for
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
        "template.jsx" : "components/{{exportsLowerCase}}/",
        "template.css" : "components/{{exportsLowerCase}}/",
        "template-test.js" : "tests/"
      },
      "script" : [{
        "name": "exports",
        "description": "Exports",
        "required": true,
        "default": "Exports",
        "type": "string"
      }, {
        "name": "extends",
        "description": "Extends",
        "default": "Extends",
        "required": true,
        "type": "string"
      }, {
        "name": "description",
        "description": "Description",
        "default": "A react component",
        "required": true,
        "type": "string"
      }, {
        "name": "ticket",
        "description": "Tracking ID",
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
is also converted to LowerCase.

eg : exports => exportsLowerCase

ROADMAP
-------
* [DONE] Useable for React Components
* [SKIPPED] Flux/Reflux Templating & better config
* [CURRENT] Custom Scripts
* General improvements to scripts and configs
* Better workflows and examples
* Better testing, break out code to modules
