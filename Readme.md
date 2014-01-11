# binding

  > Data binding for modern browsers...and IE8 >

`binding` is an automatic way of updating your HTML whenever the underlying data changes. It does one thing and does it right! It works well with your favorite framework and has been built to suit your development needs.

![binding](binding.gif)

`binding` is [highly extensible](https://github.com/bredele/binding#plugins), like jQuery you can create your own plugins or reuse some others. The possibilities are limitless and the barrier is so low that you'll want to do it straight away. 

Here's a list of available plugins:
  - [list](https://github.com/bredele/list) create a list by instantiating a template once per item from a collection
  - [event](https://github.com/bredele/event-plugin) listen or delegate events with automatic touch support
  - [control](https://github.com/bredele/control-plugin) toggle or radio elements has never been so easy
  - [stack](https://github.com/bredele/stack-plugin) create a stack of DOM elements for tab-based navigation
  - [bind](https://github.com/bredele/bind-plugin) attribute double way binding
  - [hidden](https://github.com/bredele/hidden-plugin) hide you dom element when the data changes
  - [html](https://github.com/bredele/html-plugin) bind inner html to data
  - [text](https://github.com/bredele/text-plugin) bind inner text to data

## Installation

    $ component install bredele/binding

standalone:

```html
<script src="binding.js"></script>
```

## Basics

An [example](https://github.com/bredele/binding/blob/master/examples/basics.html) is worth a thousand words.

```html
<span id="card">My github is {github}</span>
```
By default, `binding` applies variable substitution (`{variable}`) from the data model.

```js
var binding = require('binding'),
    el = document.getElementById('card');

binding({
  github: 'bredele'
}).apply(el);
```
You can use variable substitution in every possible HTML and SVG attribute. Here's an other example:

```html
<span id="card" class="{github}">
  My github is <a href="http://github.com/{github}">{github}</a>
</span>
```
The result is:
```html
<span id="card" class="bredele">
  My github is <a href="http://github.com/bredele">bredele</a>
</span>
```

## Plugins

A `binding` plugin is simply a function or an object that we use to extend the HTML capabilities. It becomes more **expressive, configurable and dynamic**.

```js
binding()
  .add('list', list)
  .apply(el);
```
You choose what plugin you want to use: **your application does just what you need and nothing more**.

```html
<ul list>
  <li></li>
</ul>
```
 > By giving a name to your plugins, you avoid scope conflicts and you can reuse a plugin multiple times.


### function plugin

Writing a plugin is as **simple as writing a JavaScript function**.

```js
binding({
    github: 'bredele'
  })
  .add('data-nickname', function(node, str) {
    node.innerHTML = "I am " + this[str];
  })
  .apply(el);
```
A function plugin always has the dom element as first argument and its scope (`this`) is the data model you passed in the constructor.

```html
<span data-nickname="github"></span>
```

In the example above, we define a plugin called `data-nickname` that set the content of the dom element with the value of the attribute `data-nickname`. The result is:

```html
<span data-nickname="github">I am bredele</span>
```
  > We advise you to use [store](https://github.com/bredele/store) as data model. Because store is based on an emitter, you'll be able to listen and react when the data changes. See [bind](https://github.com/bredele/bind-plugin) for a simple example using store events.


### object plugin

We used to say one function (or unit) equal one functionality. Potentially, a plugin can be more complex than just a function. That's the reason why a plugin can also be a JavaScript object. An object will give you more structure and control over your plugin.

```js
var state = {
  type: 'blog',
  text: 'binding component is awesome'
};

binding(state)
  .add('data-state', {
    add: function(node, attr, data) {
      if(state.type === 'blog') node[attr] = state[data];
    },
    hide: function(node) {
     if(state.type === 'blog') el.className = 'hidden';
    }
  })
  .apply(el);
```
From the HTML markup, you can call a plugin method (here `add` and `remove`) with the following syntax `method:arg,arg`. You'll find the entire spec at this [link](https://github.com/bredele/plugin-parser).

```html
<section>
  <article data-state="add:innerHTML,text"></article>
  <div data-state="hide"></div>
</section>
```

A plugin can be the backbone of your application, making easy to invent new HTML features and create reusable components.

  > See [list](https://github.com/bredele/list) for a great example of object binding. List can be used as a plugin or as an isolated component. That's one of the benefit to have objects as binding.


### Notes

  `binding` can be used with SVG elements and makes easy to create dynamic and real time charts. However, SVG doesn't support custom attributes and you should prefix your plugins with `data-` (dataset attributes).

  `binding` is not invasive and free from boilerplate: it lets you write the old plain JavaScript you like. It has been built though with some concepts such as inversion of controls and configuration because it allows you to control what is happening in your application, to easily test, maintain or reuse your plugins. Please keep that in mind when you'll write your own plugins.

  `binding` is a work in progress. We will probably make the [object plugin](https://github.com/bredele/binding#object-plugin) spec better.


## API

### Binding#(model)

  initialize a binding with a model object.

  ```js
  var binding = require('binding');
  binding({});
  ```
  or

  ```js
  var Binding = require('binding');
  
  var binding = new Binding({});
  ```  

### .add(name, binding) 

  add attribute bindings ([functions](https://github.com/bredele/binding#function-plugin) or [objects](https://github.com/bredele/binding#object-plugin)) by name

  ```js
  binding({}).add('bredele', plugin);  
  ```

### .apply(node)

  apply bindings on a given dom node

  ```js
  binding({})
    .add('bredele', plugin)
    .apply(document.body);  
  ```

## License

  MIT
