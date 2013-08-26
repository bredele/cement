
# data-binding

  Data attribute binding and interpolation

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

```js
  var domify = require('domify');
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

  //<a href="http://www.petrofeed.com" data-plug1>Click to go on<span data-plug2>PetroFeed</span></a>
```

## License

  MIT
