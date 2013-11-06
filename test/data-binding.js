var Binding = require('data-binding');
var Store = require('store');
var domify = require('domify');
var assert = require('assert');


describe('single node dataset binding', function(){

  describe('function binding', function(){

    var plugin = null,
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
      binding.data('test', plugin.test);
      binding.apply(el);

      assert('awesome' === el.innerText);
    });

    it('should apply multiple function bindings', function(){
      var el = domify('<a data-test="something" data-other="">link</a>');
      var binding = new Binding();
      binding.data('test', plugin.test);
      binding.data('other', plugin.other);
      binding.apply(el);

      assert('beauty' === el.className);
      assert('awesome' === el.innerText);
    });

    it('should apply the binding model as the scope of the function binding', function(){
      var el = domify('<a data-scope="name"></a>');
      var store = new Store({
        name : 'Wietrich'
      });
      var binding = new Binding(store);
      binding.data('scope', function(el){
        el.innerText = this.get('name'); //TODO: should pass the model attribute's name
      });
      binding.apply(el);

      assert('Wietrich' === el.innerText);
    });

    it('should binding and interpolation', function(){
      var el = domify('<a href="{link}" data-other>{title}</a>');

      var store = new Store({
        link : 'http://github.com/bredele',
        title : 'bredele'
      });

      var binding = new Binding(store);
      binding.data('other', plugin.other);
      binding.apply(el);

      assert('beauty' === el.className);
      assert('http://github.com/bredele' === el.getAttribute('href'));
      assert('bredele' === el.innerText);
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

      binding.data('model', new Plugin({
        prop : 'http://github.com/bredele'
      }));

      binding.apply(el);
      assert('http://github.com/bredele' === el.innerHTML);
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

      binding.data('model', new Plugin({
        firstname : 'Olivier',
        lastname : 'Wietrich'
      }));

      binding.apply(el);
      assert('Olivier' === el.querySelector('.first').innerHTML);
      assert('Wietrich' === el.querySelector('.last').innerHTML);
    });

    it('should apply bindings and inteprolation', function(){
      var el = domify('<a class="{className}" data-model="bind:innerHTML,prop"></a>');
      var store = new Store({
        prop : 'http://github.com/bredele',
        className : 'bredele'
      });
      var binding = new Binding(store);

      var Plugin = function(model){
        this.bind = function(el, attr, prop){
          el[attr] = model.get(prop);
        };
      };

      binding.data('model', new Plugin(store));

      binding.apply(el);
      assert('http://github.com/bredele' === el.innerHTML);
      assert('bredele' === el.className);
    });
  });
});


describe('nested node dataset binding', function(){
  it('shoud apply bindings on different dom nodes', function(){
    var el = domify('<a data-plug1><span data-plug2>test</span></a>');
    var binding = new Binding();
    binding.data('plug1', function(node){
      node.setAttribute('href', 'http://github.com/bredele');
    });
    binding.data('plug2', function(node){
      node.innerText = 'bredele';
    });
    binding.apply(el);
    assert('http://github.com/bredele' === el.getAttribute('href'));
    assert('bredele' === el.firstChild.innerText);
  });

  it('shoud apply bindings on different dom nodes with interpolation', function(){
    var el = domify('<a data-plug1>{link}<span data-plug2>{label}</span></a>');
    var binding = new Binding(new Store({
      link : 'Click to go on',
      label : 'bredele website'
    }));
    binding.data('plug1', function(node){
      node.setAttribute('href', 'http://github.com/bredele');
    });
    binding.data('plug2', function(node){
      node.innerText = 'bredele';
    });
    binding.apply(el);
    assert('http://github.com/bredele' === el.getAttribute('href'));
    assert('bredele' === el.querySelector('span').innerText);
  });
});

describe('data-set plugin', function(){
  it('should call data set plugin and pass the node and its content', function(){
    var el = domify('<span data-bind="name"></span>');
    var store = new Store({
      name : 'olivier'
    });
    var value = null;
    var node = null;
    var binding = new Binding(store);
    binding.data('bind', function(el, val){
      value = val;
      node = el;
    });
    binding.apply(el);
    assert('name' === value);
    assert(node.isEqualNode(el));
  });
});

describe('live binding', function(){
  it('use case 1: single attribute', function(){
    var el = domify('<span>{name}</span>');
    var store = new Store({
      name : 'olivier'
    });
    var binding = new Binding(store);
    binding.apply(el);
    assert('olivier' === el.innerHTML);

    store.set('name', 'bruno');
    assert('bruno' === el.innerHTML);
  });

  it('use case 2: multiple attributes on different nodes', function(){
    var el = domify('<a href={link}>{label}</a>');
    var store = new Store({
      label : 'bredele'
    });

    var binding = new Binding(store);
    binding.apply(el);
    assert('bredele' === el.innerHTML);
    assert('' === el.getAttribute('href'));

    store.set('link', 'http://github.com/bredele');
    assert('http://github.com/bredele' === el.getAttribute('href'));

  });

  it('use case 3: multiple attributes on the same node', function(){
    var el = domify('<a href={link}/repo/{name}></a>');
    var store = new Store({
      link : 'http://github.com/bredele',
      name:'store'
    });

    var binding = new Binding(store);
    binding.apply(el);
    assert('http://github.com/bredele/repo/store' === el.getAttribute('href'));
    store.set('link', 'http://github.com');
    assert('http://github.com/repo/store' === el.getAttribute('href'));
    store.set('name', 'bredele');
    assert('http://github.com/repo/bredele' === el.getAttribute('href'));    
  });

  it('use case 4: nested attributes', function(){
    var el = domify('<a href="{link}"><span>{label}</span></a>');
    var store = new Store({
      link: 'http://github.com/bredele',
      label : 'bredele'
    });
    var binding = new Binding(store);
    binding.apply(el);
    assert('bredele' === el.firstChild.innerHTML);
    assert('http://github.com/bredele' === el.getAttribute('href'));
    store.set('link', 'http://www.google.com');
    assert('http://www.google.com' === el.getAttribute('href'));
    store.set('label', 'olivier');
    assert('olivier' === el.firstChild.innerHTML);
  });

});