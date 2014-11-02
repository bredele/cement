
/**
 * Test dependencies.
 */

var assert = require('assert');
var Cement = require('..');


describe("cement binding", function() {

  describe("text nodes", function() {

    var cement;
    beforeEach(function() {
      cement = new Cement();
    });

    it("should bind text node", function(done) {
      var node = domify('<section>hello</section>');
      cement.render(node, function(str, el) {
        if(str === 'hello') done();
      });
    });
    
    it("should bind attributes content", function(done) {
      var node = domify('<section class="hello">');
      cement.render(node, function(str, el) {
        if(str === 'hello') done();
      });
    });
    
  });


  describe("attribute nodes", function() {

    var node, cement, text;
    beforeEach(function() {
      cement = new Cement();
      node = domify('<section class="section" data-custom="something">');
      text = function() {};
    });
    
    it("should bind existing attribute", function(done) {
      cement.bind('class', function(el, value) {
        if(value === 'section') done();
      });
      cement.render(node, text);
    });

    it("should pass the target node", function(done) {
      cement.bind('class', function(el, value) {
        if(el === node) done();
      });
      cement.render(node, text);
    });
    
    
    it("should bind custom attribute", function(done) {
      cement.bind('data-custom', function(el, value) {
        if(value === 'something') done();
      });
      cement.render(node, text);
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

