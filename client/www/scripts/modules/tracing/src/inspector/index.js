'use strict';

var format     = require('../format');

var templates = {
}

function Inspector (options) {
  var component = this;
  var opts = component.opts = options || {};
  component.el = opts.el || document.createElement('div');
  if (opts.trace) {
    component.trace = opts.trace;
  }
  if (opts.class) {
    component.el.classList.add(opts.class);
  }

  return component;
}

Inspector.prototype.render = function render(d, trace) {
  var trace = this.trace = trace || this.trace;
  var item = d || { type: 'base' };
  var topCosts = (item.costSummary && item.costSummary.topCosts) ? item.costSummary.topCosts : undefined;
  this.el.innerHTML = '<div>world</div>';
};

Inspector.prototype.remove = function remove() {
  if (this.opts.el) this.el.innerHTML = ''
  this.opts.app.off('inspect', this.render)
};



Inspector.prototype.toggleFunction = function (e) {
  var functions = this.querySelectorAll('.top-costs .function')
  Array.prototype.forEach.call(functions, function (item) {
    var target = item.querySelector('.header')
    if (target === e.delegateTarget) return item.classList.toggle('expanded')
    item.classList.toggle('expanded', false)
  })
};

module.exports = Inspector;
