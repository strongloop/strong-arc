var express = require('express');
var path = require('path');
var workspace = require('loopback-workspace');
var devtools = require('../devtools/server/devtools');

var app = module.exports = express();

// export the workspace object, useful e.g. in tests
app.workspace = workspace;

// REST APIs
app.use('/workspace', workspace);

app.use('/devtools', devtools);

try {
  // API explorer
  var explorer = require('loopback-explorer');
  app.use('/explorer', explorer(workspace, { basePath: '/workspace/api' }));
} catch(err) {
  // silently ignore the error, the explorer is not available in "production"
}

// static files
app.use(express.static(path.join(__dirname, '../client/www')));

var listen = app.listen;
app.listen = function() {
  var server = listen.apply(app, arguments);
  devtools.setupWebSocketServer(server);
  return server;
};
