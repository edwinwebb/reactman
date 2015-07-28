REACTMAN
========
Large teams codebases should look like a single person wrote them. Reactman is
here to help and up your productivity. Reactman is a simple little fella who
will take templates for your react components then move them about.

Reactman away!

USE
---

Install via NPM

`npm install reactman`

Then add this line to your NPM scripts

`
"reactman" : "reactman --config path-to-config.json"
`

Finally type at your prompt to create a new component from your templates

```json
npm run reactman
```

CONFIG
------
Reactman needs a configuration to run. You configure Reactman
with a configuration file specified at the CLI. Here's an example

`
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
`

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
