
/**
 * Test dependencies.
 */

var assert = require('assert');
var Cement = require('..');


describe("cement binding", function() {

  describe("attributes", function() {

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

