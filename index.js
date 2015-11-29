
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
  if(this.el.hasAttribute(name)) plugin.call(this, this.el);
  this.query('[' + name + ']', plugin);
});


Cement.prototype.query = function(selector, plugin) {
  var nodes = this.el.querySelectorAll(selector);
  for(var i = 0, l =  nodes.length; i < l; i++) {
   plugin.call(this, nodes[i]);
  }
};