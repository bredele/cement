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
      var el = domify('<a href="{link}" data-other>{title}</a>');
      var binding = new Binding(el, {
        link : 'http://www.petrofeed.com',
        title : 'PetroFeed'
      });
      binding.add('other', plugin.other);
      binding.apply();

      assert('beauty' === el.className);
      assert('http://www.petrofeed.com' === el.getAttribute('href'));
      assert('PetroFeed' === el.innerText);
    });

  });
});


describe('nested node dataset binding', function(){
  it('shoud apply bindings on different dom nodes', function(){
    var el = domify('<a data-plug1><span data-plug2>test</span></a>');
    var binding = new Binding(el);
    binding.add('plug1', function(node){
      node.setAttribute('href', 'http://www.petrofeed.com');
    });
    binding.add('plug2', function(node){
      node.innerText = 'PetroFeed';
    });
    binding.apply();
    assert('http://www.petrofeed.com' === el.getAttribute('href'));
    assert('PetroFeed' === el.firstChild.innerText);
    console.log(el);
  });

  it('shoud apply bindings on different dom nodes with interpolation', function(){
    var el = domify('<a data-plug1>{link}<span data-plug2>{label}</span></a>');
    var binding = new Binding(el, {
      link : 'Click to go on',
      label : 'petrofeed.com'
    });
    binding.add('plug1', function(node){
      node.setAttribute('href', 'http://www.petrofeed.com');
    });
    binding.add('plug2', function(node){
      node.innerText = 'PetroFeed';
    });
    binding.apply();
    assert('http://www.petrofeed.com' === el.getAttribute('href'));
    assert('PetroFeed' === el.firstChild.innerText);
    console.log(el);
  });
});