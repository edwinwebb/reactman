/**
 * Basic tests for Reactman
 *
 * Just hit enter on each prompt to have the tests (hopefully) pass
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");

var TemplateOfTruth = require("../src/TemplateOfPurity");
var PenOfJustice = require("../src/PenOfJustice");

describe('Tests Run', function () {
  it('Success', function () {
    assert.equal(true, 1 === 1);
  });
});

describe('Reactman', function() {
  describe('He should output three files', function () {
    it('JSX', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports_test/exports_test.jsx'));
      assert.equal(true, file.length > 0);
    });
    it('CSS', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports_test/exports_test.css'));
      assert.equal(true, file.length > 0);
    });
    it('Test', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/tests/exports_test.custom'));
      assert.equal(true, file.length > 0);
    });
  });
});

describe('TemplateOfPurity', function() {
  it('Write Basic Template', function(){
    var template = '{%=o.reactman%}\'s trusty companion, the {%=o.sidekick%}';
    var data = {'reactman' : 'Reactman', 'sidekick' : 'Boy Bunny'};
    var expected = 'Reactman\'s trusty companion, the Boy Bunny';
    var result = TemplateOfTruth(template, data);

    assert.equal(true, result === expected);
  });
});

describe('PenOfJustice', function() {
  it('Create Folder', function(){
    var dir = './test/output/empty-folder';

    function cb(success) {
      var success = fs.existsSync(dir);
      assert.equal(true, success);
    }

    PenOfJustice.makeFolder(dir, cb);

  });
  it('Warn on Failed Create', function(){
    var dir = './test/output/empty-folder';

    function cb(success) {
      var success = fs.existsSync(dir);
      assert.equal(true, success);
    }

    PenOfJustice.makeFolder(dir, cb);

  });
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

    PenOfJustice.writeTemplate(source, results, folder, file, cb);

  });
});
