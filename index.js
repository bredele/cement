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

Binding.prototype.apply = function() {
  // var childNodes = this.dom.childNodes;
  // for(var i = 0, l = childNodes.length; i < l; i++){
  //   var node = el.childNodes[i];
  // }
  
  //attributes
  var attributes = this.dom.attributes;
  for(var i = attributes.length; i--;){
    //attribute is nodeType 2
    var attribute = attributes[i];
    var plugin = this.plugins[attribute.nodeName.substring(5)];

    if(plugin) {
      if(typeof plugin === 'function') {
        plugin.call(this.model, this.dom);
      } else {
        //later
      }
    } else {
      var content = attribute.textContent;
      //TODO: change interpolation component 
      if(content.indexOf('{') > -1){
        attribute.textContent = interpolation(content, this.model);
      }
    }
  }

  //innerText
  this.dom.innerText = interpolation(this.dom.innerText, this.model);
};