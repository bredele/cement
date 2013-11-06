# binding

  Data attribute binding for modern browsers...and IE8>

## Installation

    $ component install bredele/binding

## Usage

Initialize the component:

```js
var Binding = require('binding');
var binding = new Binding();
```

fuction binding:
```js
  var domify = require('domify');
  var el = domify('<a link>{link}<span data-class>{label}</span></a>');
  var binding = new Binding({
    link : 'Click to go on',
    label : 'bredele'
  });
  binding.attr('link', function(node){
    node.setAttribute('href', 'http://githug.com/bredele');
  });
  binding.data('class', function(node){
    node.className = 'bredele';
  });
  binding.apply(el);

  //<a href="http://githug.com/bredele" data-plug1>Click to go on<span class="bredele" data-plug2>bredele</span></a>
```

object binding (more flexible and doesn't necessary need a model):
```js
  var domif = require('domify');
  var el = domify('<a data-model="bind:innerHTML,prop"></a>');

  var binding = new Binding();
  var Plugin = function(model){
    this.bind = function(el, attr, prop){
      el[attr] = model.prop;
    };
  };

  binding.data('model', new Plugin({
    prop : 'http://github.com'
  }));

  binding.apply(el);
  //<a data-model="bind:innerHTML,prop">http://github.com</a>
```
## API

### Binding#(model)

  initialize a binding with a model object (right now a simple Object)

### Binding#attr(name, binding) 

  add attribute bindings (functions) by name

### Binding#data(name, binding) 

  add dataset bindings (functions) by name

### Binding#apply(node)

  apply bindings on a give node


## License

  MIT
