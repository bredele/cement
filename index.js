var interpolation = require('interpolation');

/**
 * Expose 'data binding'
 */

module.exports = Binding;


function Binding(dom, model){
  this.dom = dom;
  this.model = model;
  this.plugins = {};
}

Binding.prototype.add = function(name, plugin) {
  this.plugins[name] = plugin;
};

Binding.prototype.single = function(node) {
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

Binding.prototype.apply = function(el) {
  var node = el || this.dom;
  // walk nodes
  this.single(node);
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    this.apply(child);
  }
};
