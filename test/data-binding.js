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
      var binding = new Binding();
      binding.add('test', plugin.test);
      binding.apply(el);

      assert('awesome' === el.innerText);
    });

    it('should apply multiple function bindings', function(){
      var el = domify('<a data-test="something" data-other=""></a>');
      var binding = new Binding();
      binding.add('test', plugin.test);
      binding.add('other', plugin.other);
      binding.apply(el);

      assert('awesome' === el.innerText);
      assert('beauty' === el.className);
    });

    it('should apply the binding model as the scope of the function binding', function(){
      var el = domify('<a data-scope="name"></a>');
      var binding = new Binding({
        name : 'Wietrich'
      });
      binding.add('scope', function(el){
        el.innerText = this.name;
      });
      binding.apply(el);

      assert('Wietrich' === el.innerText);
    });

    it('should binding and interpolation', function(){
      var el = domify('<a href="{link}" data-other>{title}</a>');
      var binding = new Binding({
        link : 'http://www.petrofeed.com',
        title : 'PetroFeed'
      });
      binding.add('other', plugin.other);
      binding.apply(el);

      assert('beauty' === el.className);
      assert('http://www.petrofeed.com' === el.getAttribute('href'));
      assert('PetroFeed' === el.innerText);
    });

  });

  describe('Object binding', function(){
    it('shoud apply Object as binding', function(){
      var el = domify('<a data-model="bind:innerHTML,prop"></a>');

      var binding = new Binding();
      var Plugin = function(model){
        this.bind = function(el, attr, prop){
          el[attr] = model.prop;
        };
      };

      binding.add('model', new Plugin({
        prop : 'http://www.petrofeed.com'
      }));

      binding.apply(el);
      assert('http://www.petrofeed.com' === el.innerHTML);
    });

    it('should apply nested bindings', function(){
      var el = domify('<ul><li class="first" data-model="bind:innerHTML,firstname"></li>' + 
                        '<li class="last" data-model="bind:innerHTML,lastname"></li>' +
                        '</ul>');

      var binding = new Binding();
      var Plugin = function(model){
        this.bind = function(el, attr, prop){
          el[attr] = model[prop];
        };
      };

      binding.add('model', new Plugin({
        firstname : 'Olivier',
        lastname : 'Wietrich'
      }));

      binding.apply(el);
      assert('Olivier' === el.querySelector('.first').innerHTML);
      assert('Wietrich' === el.querySelector('.last').innerHTML);      
    });

    it('should apply bindings and inteprolation', function(){
      var el = domify('<a class="{className}" data-model="bind:innerHTML,prop"></a>');
      var model = {
        prop : 'http://www.petrofeed.com',
        className : 'petrofeed'
      };
      var binding = new Binding(model);

      var Plugin = function(model){
        this.bind = function(el, attr, prop){
          el[attr] = model.prop;
        };
      };

      binding.add('model', new Plugin(model));

      binding.apply(el);
      assert('http://www.petrofeed.com' === el.innerHTML);
      assert('petrofeed' === el.className);
    });
  });
});


describe('nested node dataset binding', function(){
  it('shoud apply bindings on different dom nodes', function(){
    var el = domify('<a data-plug1><span data-plug2>test</span></a>');
    var binding = new Binding();
    binding.add('plug1', function(node){
      node.setAttribute('href', 'http://www.petrofeed.com');
    });
    binding.add('plug2', function(node){
      node.innerText = 'PetroFeed';
    });
    binding.apply(el);
    assert('http://www.petrofeed.com' === el.getAttribute('href'));
    assert('PetroFeed' === el.firstChild.innerText);
  });

  it('shoud apply bindings on different dom nodes with interpolation', function(){
    var el = domify('<a data-plug1>{link}<span data-plug2>{label}</span></a>');
    var binding = new Binding({
      link : 'Click to go on',
      label : 'petrofeed.com'
    });
    binding.add('plug1', function(node){
      node.setAttribute('href', 'http://www.petrofeed.com');
    });
    binding.add('plug2', function(node){
      node.innerText = 'PetroFeed';
    });
    binding.apply(el);
    assert('http://www.petrofeed.com' === el.getAttribute('href'));
    assert('PetroFeed' === el.querySelector('span').innerText);
  });
});