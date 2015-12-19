
/**
 * Test dependencies.
 */

var assert = require('assert');
var Cement = require('..');


describe("#from", function() {

  var obj;
  beforeEach(function() {
    obj = new Cement();
  });

  it("should render string into dom", function() {
    obj.from('<button>hello</button>');
    assert.equal(obj.el.innerHTML, 'hello');
    assert.equal(obj.el.nodeName, 'BUTTON');
  });

  it("should render from existing dom", function() {
    var div = document.createElement('ul');
    obj.from(div);
    
    assert.equal(obj.el.nodeName, 'UL');
  });

  it('should render from query selection', function() {
    document.body.insertAdjacentHTML('beforeend', '<section class="brick-test">');
    obj.from('.brick-test');

    assert.equal(obj.el.nodeName, 'SECTION');
    assert.equal(obj.el.getAttribute('class'), 'brick-test');
  });

  it('should render from other template engine', function(done) {
    obj.from(function(data) {
      if(data === obj) done();
    });
  });

});


describe('attribute plugin', function() {

 it("should call plugin on selected dom element", function(done) {
   var ui = new Cement();
   ui.from('<input placeholder="this element is required">');
   ui.attr('placeholder', function(node, text) {
     if(text === 'this element is required') done();
   });
 });


 it('should set scope of plugin', function(done) {
   var ui = new Cement();
   ui.from('<input required>');
   ui.attr('required', function(node) {
    console.log(this);
     if(this === ui) done();
   });
 });

 it('should set multiple attribute plugins', function() {
   var result = '';
   var ui = new Cement();
   ui.from('<ul><li class="hello "></li><li id="world"></li></ul>');
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
    var ui = new Cement();
    ui.from('<button>world</button>');

    ui.walk(function(node) {
      node.nodeValue = 'hello ' + node.nodeValue;
    });
    assert.equal(ui.el.innerHTML, 'hello world');
  });

  it('should render node type 1 value', function() {
    var ui = new Cement();
    ui.from('<button class="world"></button>');
    ui.walk(function(node) {
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