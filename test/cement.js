
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
    
    it("should bind existing attribute", function() {
      cement.attr('class', function(el, value) {
        assert.equal(value, 'section');
      });
      cement.scan(node);
    });

    it("should pass the target node", function() {
      cement.attr('class', function(el, value) {
        assert.equal(el, node);
      });
      cement.scan(node);
    });
    
    
    it("should bind custom attribute", function() {
      cement.attr('data-custom', function(el, value) {
        assert.equal(value, 'something');
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

