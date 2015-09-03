/**
 * Basic tests for Reactman
 *
 * Just hit enter on each prompt to have the tests (hopefully) pass
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");

var TemplateOfTruth = require("../src/TemplateOfPurity");
var writeTemplate = require("../src/PenOfJustice");

describe('Tests Run', function () {
  it('Success', function () {
    assert.equal(true, 1 === 1);
  });
});

describe('Reactman', function() {
  describe('He should output three files', function () {
    it('JSX', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports/Exports-custom.jsx'));
      assert.equal(true, file.length > 0);
    });
    it('CSS', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports/Exports-custom.css'));
      assert.equal(true, file.length > 0);
    });
    it('Test', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/tests/exports-test.custom'));
      assert.equal(true, file.length > 0);
    });
  });
  describe('He should output one old format file', function () {
    it('V2-JSX', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports/exports.jsx'));
      assert.equal(true, file.length > 0);
    });
  });
});

describe('TemplateOfPurity', function() {
  it('Write Basic Template', function(){
    var template = '{{reactman}}\'s trusty companion, the {{sidekick}}';
    var data = {'reactman' : 'Reactman', 'sidekick' : 'Boy Bunny'};
    var expected = 'Reactman\'s trusty companion, the Boy Bunny';
    var result = TemplateOfTruth(template, data);

    assert.equal(true, result === expected);
  });
});

describe('PenOfJustice', function() {
  it('Write Basic File', function(){
    var source = './test/templates/penOfJustice-test.txt';
    var results = {"something" : "is heroic"};
    var folder = './test/output/';
    var file = 'poj-test.txt';
    var expected = "Reactman is heroic";

    function cb() {
      var writtenFile = fs.readFileSync(path.resolve(__dirname,'./output/' + file));

      assert.equal(true, writtenFile === expected);
    }

    writeTemplate(source, results, folder, file, cb);

  });
});
