/**
 * Basic tests for Reactman
 *
 * Just hit enter on each prompt to have the tests (hopefully) pass
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");

describe('Tests Run', function () {
  it('Success', function () {
    assert.equal(true, 1 === 1);
  });
});

describe('Reactman', function() {
  describe('it should output three files', function () {
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
  describe('it should output one old format file', function () {
    it('V2-JSX', function () {
      var file = fs.readFileSync(path.resolve(__dirname,'./output/components/exports/exports.jsx'));
      assert.equal(true, file.length > 0);
    });
  });
});
