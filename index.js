var Store = require('datastore');
var trim = require('trim');
var indexOf = require('indexof');
var Supplant = require('supplant');


/**
 * Expose 'Binding'
 */

module.exports = Binding;


/**
 * Binding constructor.
 * 
 * @api public
 */

function Binding(model) {
  if(!(this instanceof Binding)) return new Binding(model);
  this.data(model);
  this.plugins = {};
  this.subs = new Supplant();
  this.listeners = [];
  this.filters = {};
}

//TODO: this is for view, instead doing this.binding.model = new Store();
//should we keep this or not?

Binding.prototype.data = function(data) {
  this.model = new Store(data);
  return this;
};


//todo: make better parser and more efficient
function parser(str) {
  //str = str.replace(/ /g,'');
  var phrases = str ? str.split(';') : ['main'];
  var results = [];
  for(var i = 0, l = phrases.length; i < l; i++) {
    var expr = phrases[i].split(':');

    var params = [];
    var name = expr[0];

    if(expr[1]) {
      var args = expr[1].split(',');
      for(var j = 0, h = args.length; j < h; j++) {
        params.push(trim(args[j]));
      }
    } else {
      name = 'main'; //doesn't do anything
    }

    results.push({
      method: trim(expr[0]),
      params: params
    });
  }
  return results;
}


/**
 * Bind object as function.
 * 
 * @api private
 */

function binder(obj) {
  var fn = function(el, expr) {
    var formats = parser(expr);
    for(var i = 0, l = formats.length; i < l; i++) {
      var format = formats[i];
      format.params.splice(0, 0, el);
      obj[format.method].apply(obj, format.params);
    }
  };
  //TODO: find something better
  fn.destroy = function() {
    obj.destroy && obj.destroy();
  };
  return fn;
}


/**
 * Add binding by name
 * 
 * @param {String} name  
 * @param {Object} plugin 
 * @return {Binding}
 * @api public
 */

Binding.prototype.add = function(name, plugin) {
  if(typeof plugin === 'object') plugin = binder(plugin);
  this.plugins[name] = plugin;
  return this;
};


Binding.prototype.filter = function(name, fn) {
  this.filters[name] = fn;
  return this;
};

/**
 * Substitue node text with data.
 * 
 * @param  {HTMLElement} node  type 3
 * @param  {Store} store 
 * @api private
 */

Binding.prototype.text = function(node, store) {
  var text = node.nodeValue,
      _this = this;
  //we should do {{ but it doesn't work on ie
  if(!~ indexOf(text, '{')) return;

  var exprs = this.subs.props(text),
      handle = function() {
        //should we cache a function?
        node.nodeValue = _this.subs.text(text, store.data);
      };

  handle();

  for(var l = exprs.length; l--;) {
    this.listeners.push(store.on('change ' + exprs[l], handle));
  }

};


/**
 * Apply binding's on a single node
 * 
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) {
    var attrs = node.attributes;
    for(var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i],
          plugin = this.plugins[attr.nodeName];

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
 * @param  {DomElement} node
 * @return {Binding}
 * @api public
 */

Binding.prototype.scan = function(node, bool) {
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

Binding.prototype.query = function(el) {
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
 * Destroy binding's plugins and unsubscribe
 * to emitter.
 * 
 * @api public
 */

Binding.prototype.remove = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    this.model.off(listener[0],listener[1]);
  }

  for(var name in this.plugins) {
    var plugin = this.plugins[name];
    plugin.destroy && plugin.destroy();
  }
};
