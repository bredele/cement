var interpolation = require('interpolation');

/**
 * Expose 'data binding'
 */

module.exports = Binding;


/**
 * Intitialize a binding.
 * @param {Object} model 
 */

function Binding(model){
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
    var attrs = node.attributes;
    for(var i = attrs.length; i--;){
      var attr = attrs[i];
      var plugin = this.plugins[attr.nodeName.substring(5)];
      if(plugin){
        if(typeof plugin === 'function'){
          plugin.call(this.model, node);
        }
      } else {
        var content = attr.textContent;
        if(content.indexOf('{') > -1){
          attr.textContent = interpolation(content, this.model);
        }
      }
    }
  }

  // text node
  if (node.nodeType == 3) {
    node.textContent = interpolation(node.textContent, this.model);
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
