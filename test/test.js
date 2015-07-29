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
      fs.readFileSync(path.resolve(__dirname,'./output/components/exports/exports.jsx'));
      assert.equal(true, 1 === 1);
    });
    it('CSS', function () {
      fs.readFileSync(path.resolve(__dirname,'./output/components/exports/exports.css'));
      assert.equal(true, 1 === 1);
    });
    it('Test', function () {
      fs.readFileSync(path.resolve(__dirname,'./output/tests/exports.js'));
      assert.equal(true, 1 === 1);
    });
  });
});
