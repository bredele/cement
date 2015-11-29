
/**
 * Test dependencies.
 */

var assert = require('assert');
var cement = require('..');



describe('render', function() {

  var ui;
  beforeEach(function() {
    ui = cement();
  });

  it("should render string into dom", function() {
    var ui = cement('<button>hello</button>');
    assert.equal(ui.el.outerHTML, '<button>hello</button>');
  });


});