# data-binding

  Data attribute binding for modern browsers...and IE8>

## Installation

    $ component install bredele/data-binding

## API

### Binding#(model)

  initialize a binding with a model object (right now a simple Object)

### Binding#add(name, binding)

  add bindings (functions) by name

### Binding#apply(node)

  apply bindings on a give node

## Example

fuction binding:
```js
  var domify = require('domify');
  var el = domify('<a data-plug1>{link}<span data-plug2>{label}</span></a>');
  var binding = new Binding({
    link : 'Click to go on',
    label : 'bredele'
  });
  binding.add('plug1', function(node){
    node.setAttribute('href', 'http://githug.com/bredele');
  });
  binding.add('plug2', function(node){
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

  binding.add('model', new Plugin({
    prop : 'http://github.com'
  }));

  binding.apply(el);
  //<a data-model="bind:innerHTML,prop">http://github.com</a>
```

## License

  MIT
