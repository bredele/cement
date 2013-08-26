
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

Binding.prototype.apply = function() {
  // var childNodes = this.dom.childNodes;
  // for(var i = 0, l = childNodes.length; i < l; i++){
  //   var node = el.childNodes[i];
  // }
  
  var attributes = this.dom.attributes;
  for(var i = attributes.length; i--;){
    var attribute = attributes[i];
    var plugin = this.plugins[attribute.nodeName.substring(5)];
    if(plugin) {
      if(typeof plugin === 'function') {
        plugin.call(this.model, this.dom);
      } else {
        //later
      }
    }


  }
};