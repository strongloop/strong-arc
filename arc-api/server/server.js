var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var app = module.exports = loopback();

(process.env.SL_ARC_FEATURE_FLAGS || '').split(path.delimiter).forEach(function(f) {
  app.enable('feature:' + f);
});

boot(app, __dirname);
