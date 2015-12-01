
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


/**
 * Cement constructor.
 *
 * Examples:
 *
 *  var ui = new Cement('<button>hello</button>');
 *  var ui = new Cement(document.body);
 *  var ui = new Cement('body');
 * 
 * @param {String|Element} tmpl
 * @api public
 */

function Cement(tmpl) {
  this.el = stomach(tmpl);
}


/**
 * Attribute plugin.
 *
 * A plugin is a function that takes the node 
 * as well as the node value of the attribute
 * specified. It allows to apply transformation
 * on a node.
 *
 * Examples:
 *
 *  var ui = new Cement('<input required>');
 *  ui.attr('required', function() {
 *    // do something
 *  })
 * 
 * @param {String} name
 * @param {Function} plugin
 * @api public
 */

Cement.prototype.attr = many(function(name, plugin) {
  var that = this
  if(that.el.hasAttribute(name)) plugin.call(that, that.el, that.el.getAttribute(name));
  that.query('[' + name + ']', function(node) {
    plugin.call(that, node, node.getAttribute(name));
  });
  return that;
});


/**
 * Query all nodes.
 *
 * Examples:
 *
 *  var ui = new Cement('<input required>');
 *  ui.query('input', function() {
 *    // do something
 *  })
 * 
 * @param {String} selector
 * @param {Function} cb
 * @api public
 */

Cement.prototype.query = function(selector, cb) {
  loop(this.el.querySelectorAll(selector), cb);
  return this;
};


/**
 * Walk all nodes.
 *
 * Allows to transform the text content of every
 * nodes (attribute and text nodes). Useful to
 * apply data binding.
 *
 * Examples:
 *
 *  var ui = new Cement('<input required>');
 *  ui.node(unction() {
 *    // do something
 *  })
 * 
 * @param {Function} text
 * @api public
 */

Cement.prototype.node = function(text) {
  walk(this.el, function(node) {
    if(node.nodeType === 1) loop(node.attributes, text);
    else text(node);
  });
};


/**
 * Loop over array.
 * 
 * @node should use module looping
 * @param {Array} nodes
 * @param {Function} cb
 * @api private
 */

function loop(nodes, cb) {
  for(var i = 0, l =  nodes.length; i < l; i++) {
   cb(nodes[i]);
  }
}
