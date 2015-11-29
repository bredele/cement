
/**
 * Test dependencies.
 */

var assert = require('assert');
var cement = require('..');



describe('render', function() {


  it("should render string into dom", function() {
    var ui = cement('<button>hello</button>');
    assert.equal(ui.el.outerHTML, '<button>hello</button>');
  });

  it("should render from existing dom", function() {
    var btn = document.createElement('button');
    var ui = cement(btn);
    
    assert.equal(ui.el, btn);
  });

  it('should render from query selection', function() {
    var ui = cement('body');

    assert.equal(ui.el, document.body);
  });


});