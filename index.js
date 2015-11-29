
/**
 * Module dependencies.
 */

var walk = require('domwalk');
var stomach = require('stomach');


/**
 * Expose 'Cement'
 */

module.exports = function(tmpl) {
  return new Cement(tmpl);
};


function Cement(tmpl) {
  this.el = stomach(tmpl);
}



Cement.prototype.attr = function(name, plugin) {
  if(this.el.hasAttribute(name)) plugin(this.el);
  var nodes = this.el.querySelectorAll('[' + name + ']');
  for(var i = 0, l =  nodes.length; i < l; i++) {
    plugin(nodes[i]);
  }
};



Cement.prototype.render = function() {

};
