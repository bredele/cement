# Cement
[![Build Status](https://travis-ci.org/bredele/binding.png?branch=master)](https://travis-ci.org/bredele/binding)

  Mixed cement with HTML and JavaScript to obtain a flexible and insanely fast live binding.


  Cement is an automatic way of updating your HTML whenever the underlying data changes. It works on all major browsers (IE8 included) and is incredibly easy to learn. It's the soft glue that hardens your applications.


## A 10 seconds example

HTML:
```html
<span>Cement is {{ adjective }}</span>
```

JavaScript:
```js
cement({
  adjective: 'awesome'
}).scan(el);
```

Result:
```html
<span>Cement is awesome</span>
```

## Installation

component:

    $ component install bredele/cement

nodejs:

    $ component install cement

standalone:

```html
<script src="cement.js"></script>
```

## Features

### Interpolation

  Cement uses [supplant](http://github.com/bredele/supplant) which allows you to substitute expressions (enclosed in `{{ }}` braces) with your data. Whenever the data changes, the expression is updated.

```html
<span class="{{ type }}">My name is {{ name }}</span>
```

  Expressions can be used in every dom nodes and attributes, it even works with SVG:

```html
<svg>
  <text fill="url(#filler)">{{ label }}</text>
</svg>
```

  You can compute your data or use all sort of operators:

```html
<span>My name is {{ firstName + ' ' + lastName }}</span>
```

  And filter the expression with custom handlers:
 
```html
<span>My name is {{ name } | upper }</span>
``` 

  Cement is not a template engine like Mustache/Handlebars, it works directly on dom nodes (not on strings) and can be easily included in your existing projects.


### Data binding and plugins

  Cement is higly extensible and allows you to create `data bindings` or `directives`. Here's a quick example:

HTML:
```html
<ul repeat>
  <li>{{ name }}</li>
</ul>
```

JavaScript:
```js
cement(data)
  .add('repeat', repeat())
  .scan(el);
```

  A directive in cement is called a plugin. Like jQuery you can create your own plugins or reuse some others. The possibilities are limitless and the barrier is so low (a plugin is just a simple function) that you'll want to do it straight away.

```js
cement(data)
  .add('repeat', function(el) {
    // repeat el first child
  })
  .scan(el);
```

  At the opposite of some frameworks out there, you can give a name to your bindings and reuse them multiple times. It's important because you'll probably have views with the same plugin that overlaps and you want to avoid conflicts of memory leaks. If it doesn't make sense here's an example:

  Let's say you are using a framework with built-in directives. One of them is `on-click` and allows you to execute a function on click. You have two views, each of them use `on-click`.

HTML:
```html
<div class="view1">
  <button class="btn1" on-click="method1"></button>
  <div class="view2">
    <button class="btn2" on-click="method2"></button>
  </div>
</div>
```
  In this example method2 will be called twice when you click on `btn2` because view2 overlap view1 and have the same directive name. That's not the behaviour you are expecting! Cement resolve this problem by giving the name you want to your plugin:


```js
var view1 = cement()
  .add('on-click1', events(obj))
  .scan(view1);

 var view2 = cement()
  .add('on-click2', events(obj))
  .scan(view2); 
```

  It makes your code more expressive and allows you to export and reuse plugins easily.


## API

### cement(obj)

  Initialize a binding with a model object (optional). You can either pass a [datastore](http://github.com/bredele/datastore) or a plain JavaScript object which will be convert into a datastore (see [data](#dataobj))

  ```js
  var cement = require('cement');
  cement(obj);
  ```
### .data(obj)

  Set cement model.

  ```js
  cement().data(obj);
  ```

  A cement model is based on [datastore](http://github.com/bredele/datastore), an extensible and obervable model which works on both client and server sides.

### .add(name, binding) 

  Add function plugin.

  ```js
  cement().add('data-plugin', plugin);  
  ```

  ```html
  <span data-plugin="whatever"></span>
  ```
  A plugin accepts the attached dom node as first argument and the
  plugin content as second argument.

  ```js
  function plugin(el, expr) {
    console.log(expr);
    // => 'whatever'
  }
  ```

  The scope of the plugin (`this`) function is the model.

### .scan(node)

  Apply substitutions and plugins on a given dom node

  ```js
  cement()
    .apply(document.body);  
  ```

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
