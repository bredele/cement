var Interpolation = require('node-substitution');

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

Binding.prototype.add = function(name, plugin) {
  this.plugins[name] = plugin;
};



/**
 * Apply bindings on a single node
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.applyBindings = function(node) {
  //dom element
  if (node.nodeType === 1) {
    //TODO: clean this up
    var attrs = node.attributes;
    for(var i = attrs.length; i--;){
      var attr = attrs[i];
      var plugin = this.plugins[attr.nodeName.substring(5)];
      var content = attr.textContent; //doesn't work on IE
      if(plugin){
        if(typeof plugin === 'function'){
          //TODO: refactor when we'll have more functionalities
          //in plugin
          plugin.call(this.model, node, content);
        } else {
          var expr = content.split(':');
          var method = expr[0];
          var params = expr[1].split(',');
          params.splice(0,0,node);
          plugin[method].apply(plugin, params);
        }
      } else {
        if(content.indexOf('{') > -1){
          //a node attribute has only one child
          new Interpolation(attr.firstChild, this.model);
        }
      }
    }
  }

  // text node
  if (node.nodeType == 3) {
    new Interpolation(node, this.model);
  }
};

/**
 * Apply bindings on nestes DOM element.
 * @param  {DomElement} node 
 * @api public
 */

Binding.prototype.apply = function(node) {
  this.applyBindings(node);

  //child nodes are elements and text
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    this.apply(child);
  }
};
