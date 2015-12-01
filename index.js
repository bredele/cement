
/**
 * Module dependencies.
 */

var stomach = require('stomach');
var walk = require('domwalk');
var many = require('many');



/**
 * Expose 'Cement'
 */

module.exports = Cement;


function Cement(tmpl) {
  this.el = stomach(tmpl);
}

Cement.prototype.attr = many(function(name, plugin) {
  var that = this
  if(that.el.hasAttribute(name)) plugin.call(that, that.el, that.el.getAttribute(name));
  that.query('[' + name + ']', function(node) {
    plugin.call(that, node, node.getAttribute(name));
  });
  return that;
});


Cement.prototype.query = function(selector, plugin) {
  loop(this.el.querySelectorAll(selector), plugin);
  return this;
};


Cement.prototype.node = function(text) {
  walk(this.el, function(node) {
    if(node.nodeType === 1) loop(node.attributes, text);
    else text(node);
  });
};


function loop(nodes, plugin) {
  for(var i = 0, l =  nodes.length; i < l; i++) {
   plugin(nodes[i]);
  }
}
