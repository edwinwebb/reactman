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
        "template.jsx" : "components/{%=o.exportsLowerCase%}/{%=o.exports%}-custom.jsx",
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
