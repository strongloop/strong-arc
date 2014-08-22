var express = require('express');
var path = require('path');
var workspace = require('loopback-workspace');
var explorer = require('loopback-explorer');

var app = module.exports = express();

// REST APIs
app.use('/workspace', workspace);

try {
  // API explorer
  app.use('/explorer', explorer(workspace, { basePath: '/workspace/api' }));
} catch(err) {
  // silently ignore the error, the explorer is not available in "production"
}

// static files
app.use(express.static(path.join(__dirname, '../client/www')));
