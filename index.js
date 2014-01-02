var subs = require('subs'),
    indexOf = require('indexof'),
    parser = require('plugin-parser');


/**
 * Expose 'data binding'
 */

module.exports = Binding;


/**
 * Intitialize a binding.
 * @param {Object} model 
 */

function Binding(model){
  if(!(this instanceof Binding)) return new Binding(model);
  //TODO: mixin with store if not instanceof store
  this.model = model;
  //this.depth = -1;
  this.plugins = {};
}


/**
 * Bind object as function.
 * @api private
 */

function binder(obj) {
  return function(el, expr) {
    var formats = parser(expr);
    for(var i = 0, l = formats.length; i < l; i++) {
      var format = formats[i];
      format.params.splice(0, 0, el);
      obj[format.method].apply(obj, format.params);
    }
  };
}


/**
 * Add binding by name
 * @param {String} name  
 * @param {Object} plugin 
 * @api public
 */

Binding.prototype.add = function(name, plugin) {
  if(typeof plugin === 'object') plugin = binder(plugin);
  this.plugins[name] = plugin;
};


/**
 * Attribute binding.
 * @param  {HTMLElement} node 
 * @api private
 */

Binding.prototype.bindAttrs = function(node){
  var attrs = node.attributes;
  //reverse loop doesn't work on IE...
  for(var i = 0, l = attrs.length; i < l; i++){
    var attr = attrs[i],
        plugin = this.plugins[attr.nodeName],
        content = attr.nodeValue;

    if(plugin) {
      plugin.call(this.model, node, content);
    } else if(indexOf(content, '{') > -1){
      subs(attr, this.model);
    }
  }
};


/**
 * Apply bindings on a single node
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) return this.bindAttrs(node);
  // text node
  if (type === 3) subs(node, this.model);
};


/**
 * Apply bindings on nested DOM element.
 * @param  {DomElement} node 
 * @api public
 */

Binding.prototype.apply = function(node) {
  var nodes = node.childNodes;
  this.bind(node);
  //use each?
  for (var i = 0, l = nodes.length; i < l; i++) {
    this.apply(nodes[i]);
  }
};
