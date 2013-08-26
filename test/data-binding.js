var interpolation = require('dom-interpolation');
var Binding = require('data-binding');
var domify = require('domify');
var assert = require('assert');


describe('single node dataset binding', function(){

  describe('function binding', function(){

    var plugin = null,
        el = null,
        binding = null;

    beforeEach(function(){
      plugin = {
        test : function(el){
          el.innerText = 'awesome';
        },
        other : function(el){
          el.className = 'beauty';
        }
      };

    });

    it('should apply function as binding', function(){
      var el = domify('<a data-test="something"></a>');
      var binding = new Binding(el);
      binding.add('test', plugin.test);
      binding.apply();

      assert('awesome' === el.innerText);
    });

    it('should apply multiple function bindings', function(){
      var el = domify('<a data-test="something" data-other=""></a>');
      var binding = new Binding(el);
      binding.add('test', plugin.test);
      binding.add('other', plugin.other);
      binding.apply();

      assert('awesome' === el.innerText);
      assert('beauty' === el.className);
    });

    it('should apply the binding model as the scope of the function binding', function(){
      var el = domify('<a data-scope="name"></a>');
      var binding = new Binding(el, {
        name : 'Wietrich'
      });
      binding.add('scope', function(el){
        el.innerText = this.name;
      });
      binding.apply();

      assert('Wietrich' === el.innerText);
    });

    it('should binding and interpolation', function(){
      var el = domify('<a href="{link}" data-test="something"></a>');
      var binding = new Binding(el, {
        link : 'http://www.petrofeed.com'
      });
      binding.add('test', plugin.test);

      assert('awesome' === el.innerText);
      assert('http://www.petrofeed.com' === el.getAttribute('href'));
    });

  });
});


