
/**
 * Module dependencies.
 */

var walk = require('domwalk');


/**
 * Expose 'Cement'
 */

module.exports = Cement;


/**
 * Cement constructor.
 * @api public
 */

function Cement() {
  this.bindings = {};
}


/**
 * Bind node attribute with
 * function.
 * 
 * @param  {String} name 
 * @param  {Function} binding
 */

Cement.prototype.attr = function(name, binding) {
  this.bindings[name] = binding;
};


/**
 * 
 * 
 * @param  {Element} root 
 * @return {this} 
 */

Cement.prototype.scan = function(root) {
  var bindings = this.bindings;
  walk(root, function(node) {
    var type = node.nodeType;
    if(type === 1) {
      var attrs = node.attributes;
      for(var i = 0, l = attrs.length; i < l; i++) {
        var attr = attrs[i];
        var plugin = bindings[attr.nodeName];
        if(plugin) plugin(node, attr.nodeValue);
      }
    }
  });
};
