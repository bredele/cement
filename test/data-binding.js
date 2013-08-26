var interpolation = require('dom-interpolation');
var Binding = require('data-binding');
var domify = require('domify');
var assert = require('assert');


describe('single node dataset binding', function(){
  it('should apply function as binding', function(){
    var plugin = {
      test : function(el){
        el.innerText = 'awesome';
      }
    };
    var el = domify('<span data-test="something"></span>');

    var binding = new Binding(el);
    binding.add('test', plugin.test);

    binding.apply();

    assert('awesome' === el.innerText);
  });

});


