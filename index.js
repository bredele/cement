
/**
 * Module dependencies.
 */

var stomach = require('stomach');
var walk = require('domwalk');
var many = require('many');



/**
 * Expose 'Cement'
 */

module.exports = function(tmpl) {
  return new Cement(tmpl);
};


function Cement(tmpl) {
  this.el = stomach(tmpl);
}

Cement.prototype.attr = many(function(name, plugin) {
  // @note refactor using .use ( .use(plugin, node, attr))
  if(this.el.hasAttribute(name)) plugin.call(this, this.el, this.el.getAttribute(name));
  this.query('[' + name + ']', function(node) {
    plugin.call(this, node, node.getAttribute(name));
  });
  return this;
});


Cement.prototype.query = function(selector, plugin) {
  var nodes = this.el.querySelectorAll(selector);
  // should we use looping?
  for(var i = 0, l =  nodes.length; i < l; i++) {
   plugin.call(this, nodes[i]);
  }
  return this;
};


// template agnostic :DD
Cement.prototype.render = function(text) {
  walk(this.el, function(node) {
    if(node.nodeType === 1) {
      var attrs = node.attributes;
      for(var i = 0, l = attrs.length; i < l; i++) {
        text(attrs[i]);
      }
    } else {
      text(node);
    }
  });
};
