
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



Cement.prototype.attr = function() {

};


Cement.prototype.render = function() {

};
