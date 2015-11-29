
/**
 * Test dependencies.
 */

var assert = require('assert');
var cement = require('..');


describe('API', function() {


  it("should have the following API", function() {
    var ui = cement();
    assert(ui.attr);
    assert(ui.render);
  });

});