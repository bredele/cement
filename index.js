var Interpolation = require('node-substitution');
var indexOf = require('indexof');
var parser = require('plugin-parser');

/**
 * Expose 'data binding'
 */

module.exports = Binding;


/**
 * Intitialize a binding.
 * @param {Object} model 
 */

function Binding(model){
  //TODO: mixin with store if not instanceof store
  this.model = model;
  this.plugins = {};
}


/**
 * Add binding by name
 * @param {String} name  
 * @param {Object} plugin 
 * @api public
 */

Binding.prototype.attr = function(name, plugin) {
  this.plugins[name] = plugin;
};


/**
 * Add binding by name
 * @param {String} name  
 * @param {Object} plugin 
 * @api public
 */

Binding.prototype.data = function(name, plugin) {
  this.plugins["data-" + name] = plugin;
};


/**
 * Attribute binding.
 * @param  {HTMLElement} node 
 * @api private
 */

Binding.prototype.attrsBinding = function(node){
  var attributes = node.attributes;
  //reverse loop doesn't work on IE...
  for(var i = 0, l = attributes.length; i < l; i++){
    var attribute = attributes[i];
    var plugin = this.plugins[attribute.nodeName];
    var content = attribute.nodeValue;

    if(plugin) {
      if(typeof plugin === 'function'){
        plugin.call(this.model, node, content);
      } else {
        //is it necessary...event delegation?
        var formats = parser(content);
        for(var j = 0, h = formats.length; j < h; j++) {
          var format = formats[j];
          format.params.splice(0,0, node);
          plugin[format.method].apply(plugin, format.params);
        }
      }
    } else {
      if(indexOf(content, '{') > -1){
        new Interpolation(attribute, this.model);
      }
    }
  }
};


/**
 * Apply bindings on a single node
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.applyBindings = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) {
    this.attrsBinding(node);
  }
  // text node
  if (type == 3) {
    new Interpolation(node, this.model);
  }
};


/**
 * Apply bindings on nested DOM element.
 * @param  {DomElement} node 
 * @api public
 */

Binding.prototype.apply = function(node) {
  var nodes = node.childNodes;
  this.applyBindings(node);

  //child nodes are elements and text
  for (var i = 0, l = nodes.length; i < l; i++) {
    var child = nodes[i];
    this.apply(child);
  }
};
