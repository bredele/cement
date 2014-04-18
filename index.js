
/**
 * Module dependencies.
 * @api private
 */

var Store = require('datastore');
var indexOf = require('indexof');
var Supplant = require('supplant');


/**
 * Expose 'Cement'
 */

module.exports = Cement;


/**
 * Cement constructor.
 * 
 * @api public
 */

function Cement(model) {
  if(!(this instanceof Cement)) return new Cement(model);
  this.data(model);
  this.plugins = {};
  this.subs = new Supplant();
  this.listeners = [];
}


/**
 * Set data store.
 * 
 * @param  {Object} data 
 * @return {this}
 * @api public
 */

Cement.prototype.data = function(data) {
  this.model = new Store(data);
  return this;
};


/**
 * Add binding by name.
 * 
 * @param {String} name  
 * @param {Object} plugin 
 * @return {this}
 * @api public
 */

Cement.prototype.add = function(name, plugin) {
  this.plugins[name] = plugin;
  return this;
};



/**
 * Substitue node text with data.
 * 
 * @param  {HTMLElement} node  type 3
 * @param  {Store} store 
 * @api private
 */

Cement.prototype.text = function(node, store) {
  var text = node.nodeValue;
  var _this = this;
  //we should do {{ but it doesn't work on ie
  if(!~ indexOf(text, '{')) return;

  var exprs = this.subs.props(text);
  var handle = function() {
    //should we cache a function?
    node.nodeValue = _this.subs.text(text, store.data);
  };

  handle();

  for(var l = exprs.length; l--;) {
    this.listeners.push(store.on('change ' + exprs[l], handle));
  }
};


/**
 * Apply bindings on a single node
 * 
 * @param  {Element} node 
 * @api private
 */

Cement.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) {
    var attrs = node.attributes;
    for(var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i];
      var plugin = this.plugins[attr.nodeName];

      if(plugin) {
        plugin.call(this.model, node, attr.nodeValue);
      } else {
        this.text(attr, this.model);
      }
    }
    return;
  }
  // text node
  if (type === 3) this.text(node, this.model);
};


/**
 * Apply bindings on nested DOM element.
 * 
 * @param  {Element} node
 * @return {this}
 * @api public
 */

Cement.prototype.scan = function(node, bool) {
  if(bool) return this.query(node);
  var nodes = node.childNodes;
  this.bind(node);
  for (var i = 0, l = nodes.length; i < l; i++) {
    this.scan(nodes[i]);
  }
  return this;
};


/**
 * Query plugins and execute them.
 * 
 * @param  {Element} el 
 * @api private
 */

Cement.prototype.query = function(el) {
  //TODO: refactor
  var parent = el.parentElement;
  if(!parent) {
    parent = document.createDocumentFragment();
    parent.appendChild(el);
  }
  for(var name in this.plugins) {
    var nodes = parent.querySelectorAll('[' + name + ']');
    for(var i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      this.plugins[name].call(this.model, node, node.getAttribute(name));
    }
  }
};


/**
 * Unsubscribe to events.
 * 
 * @api public
 */

Cement.prototype.remove = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    this.model.off(listener[0],listener[1]);
  }
};
