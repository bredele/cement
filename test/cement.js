
/**
 * Test dependencies.
 */

var assert = require('assert');
var Cement = require('..');



describe('render', function() {


  it("should render string into dom", function() {
    var ui = new Cement('<button>hello</button>');
    assert.equal(ui.el.outerHTML, '<button>hello</button>');
  });

  it("should render from existing dom", function() {
    var btn = document.createElement('button');
    var ui = new Cement(btn);
    assert.equal(ui.el, btn);
  });

  it('should render from query selection', function() {
    var ui = new Cement('body');
    assert.equal(ui.el, document.body);
  });

  // it('should render from other template engine', function(done) {

  // });


});


describe('attribute plugin', function() {

 it("should call plugin on selected dom element", function(done) {
   var ui = new Cement('<input placeholder="this element is required">');
   ui.attr('placeholder', function(node, text) {
     if(text === 'this element is required') done();
   });
 });


 it('should set scope of plugin', function(done) {
   var ui = new Cement('<input required>');
   ui.attr('required', function(node) {
    console.log(this);
     if(this === ui) done();
   });
 });

 it('should set multiple attribute plugins', function() {
   var result = '';
   var ui = new Cement('<ul><li class="hello "></li><li id="world"></li></ul>');
   ui.attr({
     'class' : function(node, text) {
       result += text;
     },
     id: function(node, text) {
       result += text;
     }
   });
  assert.equal(result, 'hello world');
 });

 // it('should select specific attribute and apply plugin', function() {
 //    var result = "";
 //    var ui = new Cement('<ul><li class="item"><input required="hello "></li><li class="item"><input required="world"></li></ul>');
 //    ui.attr('.item', 'required', function(node) {
 //      result += node.getAttribute('required');
 //    });
 //    assert.equal(result, 'hello world');
 // });


});


describe('render', function() {

  it('should render node type 2 value', function() {
    var ui = new Cement('<button>world</button>');
    ui.node(function(node) {
      node.nodeValue = 'hello ' + node.nodeValue;
    });
    assert.equal(ui.el.innerHTML, 'hello world');
  });

  it('should render node type 1 value', function() {
    var ui = new Cement('<button class="world"></button>');
    ui.node(function(node) {
      node.nodeValue = 'hello ' + node.nodeValue;
    });
    assert.equal(ui.el.className, 'hello world');
  });

  // it('should render a fragment of a node', function() {
  //   var result = "";
  //   var ui = new Cement('<section class="hello"><button class="world"></button></section>');
  //   ui.node(function(node) {
  //     result += node.nodeValue;
  //   }, 'button.world');
  //   assert.equal(result, 'world');
  // });
});