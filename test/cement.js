
/**
 * Test dependencies.
 */

var assert = require('assert');
var Cement = require('..');


describe("cement binding", function() {

  describe("attribute nodes", function() {

    var node, cement;
    beforeEach(function() {
      cement = new Cement();
      node = domify('<section class="section" data-custom="something">');
    });
    
    it("should bind existing attribute", function(done) {
      cement.attr('class', function(el, value) {
        if(value === 'section') done();
      });
      cement.scan(node);
    });

    it("should pass the target node", function(done) {
      cement.attr('class', function(el, value) {
        if(el === node) done();
      });
      cement.scan(node);
    });
    
    
    it("should bind custom attribute", function(done) {
      cement.attr('data-custom', function(el, value) {
        if(value === 'something') done();
      });
      cement.scan(node);
    });

  });

  describe("text nodes", function() {

    var cement;
    beforeEach(function() {
      cement = new Cement();
    });

    it("should bind text node", function(done) {
      var node = domify('<section>hello</section>');
      cement.text(function(str) {
        if(str === 'hello') done();
      });
      cement.scan(node);
    });
    
    it("should bind attributes content", function() {
      var node = domify('<section class="hello">');
      cement.text(function(str) {
        if(str === 'hello') done();
      });
      cement.scan(node);
    });
    
    
  });
  
  
});


/**
 * Create dom from string.
 * 
 * @param  {String} text
 * @return {Element}
 */

function domify(text) {
  var div = document.createElement('div');
  div.innerHTML = text;
  return div.firstChild;
}

