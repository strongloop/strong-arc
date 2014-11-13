var path = require('path');
var fs = require('fs-extra');
var SANDBOX = exports.SANDBOX = path.join(__dirname, '..', 'sandbox');
var SIMPLE_APP = path.join(__dirname, '..', 'fixtures', 'simple-app');

exports.init = function(done) {
  fs.remove(SANDBOX, function(err) {
    if(err) return done(err);
    fs.mkdir(SANDBOX, done);
  });
}

exports.createEmptyApp = function(done) {
  fs.copy(SIMPLE_APP, SANDBOX, done);
}
