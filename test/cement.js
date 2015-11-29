
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

  // it('should render from other template engine', function(done) {

  // });


});


describe('attribute plugin', function() {

 it("should call plugin on selected dom element", function() {
   var ui = cement('<input required>');
   ui.attr('required', function(node) {
     node.setAttribute('placeholder', 'this element is required');
   });
   assert.equal(ui.el.getAttribute('placeholder'), 'this element is required');
 });


});