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
### Function binding

Associate a binding to a function.

```html
<!-- el -->
<a link>{link}<span data-class>{label}</span></a>
```

A binding can be either an attribute or a dataset attribute.
```js
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

```

result:
```html
<a href="http://githug.com/bredele" link>
  Click to go on<span class="bredele" data-class>bredele</span>
</a>>
```

**Note:** 
  - the first argument of the function is the DOM node associated to the binding.
  - the scope of the function is the object passed to the Binding constructor. 

### Object binding

Associate a binding to an object. Every function inside this object can be called by the binding.

```html
<!-- el -->
<a data-model="bind:innerHTML,prop"></a>'
```


```js
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
```

result:

```html
<a data-model="bind:innerHTML,prop">http://github.com</a>
```

**Note:** 
  - the first argument of the function is the DOM node associated to the binding.
  - Object binding are more flexible and doesn't necessary need a model object.
  - the binding are parsed according the following format (method:arg,arg,...)

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
