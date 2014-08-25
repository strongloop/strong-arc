var express = require('express');
var path = require('path');
var workspace = require('loopback-workspace');

var app = module.exports = express();

// REST APIs
app.use('/workspace', workspace);

try {
  // API explorer
  var explorer = require('loopback-explorer');
  app.use('/explorer', explorer(workspace, { basePath: '/workspace/api' }));
} catch(err) {
  // silently ignore the error, the explorer is not available in "production"
}

// static files
app.use(express.static(path.join(__dirname, '../client/www')));
