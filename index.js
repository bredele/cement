
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
 * @api public
 */

Cement.prototype.bind = function(name, binding) {
  this.bindings[name] = binding;
};


/**
 * Apply bindings on dom
 * element (root).
 *
 * A mandatory callback (text) allows
 * you to get the content of every text
 * node and transform it.
 * 
 * @param  {Element} root 
 * @param {Function} text 
 * @api public
 */

Cement.prototype.render = function(root, text) {
  var bindings = this.bindings;
  walk(root, function(node) {
    var type = node.nodeType;
    if(type === 1) {
      var attrs = node.attributes;
      for(var i = 0, l = attrs.length; i < l; i++) {
        var attr = attrs[i];
        var plugin = bindings[attr.nodeName];
        if(plugin) plugin(node, attr.nodeValue);
        else text(attr.nodeValue, attr);
      }
    } else {
      text(node.nodeValue, node);
    }
  });
};
