REACTMAN
========
Large teams codebases should look like a single person wrote them. Reactman is
here to help and up your productivity. Reactman is a simple little fella who
will take templates for your react components, populate them via the command
line then move them into your codebase.

Reactman away!

USE
---

Install via NPM

`npm install reactman`

Then add this line to your NPM scripts

`
"reactman" : "reactman --config path-to-config.json"
`

Make a config file from the example below. Then finally type at your prompt to
create a new component from your templates

`
npm run reactman
`

CONFIG
------
Reactman needs a configuration to run. You configure Reactman
with a configuration file specified at the CLI. Here's an example

```json
{
  "templatesFolder" : "./templates/",
  "testsFolder" : "./app/__tests__/",
  "outputFolder" : "./app/components/",
  "templates" : {
    "component" : {
      "src" : "template.jsx",
      "test" : "template-test.js",
      "style" : "template.css"
    }
  },
  "issue_tracker" : "https://github.com/edwinwebb/reactman/issues/"
}
```

TEMPLATES
------
Current template vars are:

* exports
* exportsLowerCase
* extends
* ticketLink
* ticket
* description

ROADMAP
-------
* V1 - Useable for React Components
* V2 - Flux/Reflux Templating & better config
* V3 - Custom Scripts
* V4 - Better workflows and examples
