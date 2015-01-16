var express = require('express');
var path = require('path');
var workspace = require('loopback-workspace');
var buildDeploy = require('../build-deploy/server/server');
var devtools = require('../devtools/server/devtools');
var pm = require('../process-manager/server');
var arcApi = require('../arc-api/server/server');
var app = module.exports = express();
var meshProxy = require('strong-mesh-client/proxy/server')(
  path.join(process.cwd(), process.env.MANAGER_CONFIG || 'arc-manager.json')
);


// export the workspace object, useful e.g. in tests
app.workspace = workspace;

// REST APIs
app.use('/workspace', workspace);
app.use('/devtools', devtools);
app.use('/build-deploy', buildDeploy);
app.use('/process-manager', pm);
app.use('/api', arcApi);
app.use('/manager', meshProxy);

try {
  // API explorer
  var explorer = require('loopback-explorer');
  app.use('/explorer', explorer(workspace, { basePath: '/workspace/api' }));
} catch(err) {
  // silently ignore the error, the explorer is not available in "production"
}

// static files
app.use(require('express-jsxtransform')())
   .use(express.static(path.join(__dirname, '../client/www')));

var listen = app.listen;
app.listen = function() {
  var server = process.server = listen.apply(app, arguments);
  meshProxy.setupPrimus(server);
  devtools.setupWebSocketServer(server);
  pm.start();
  return server;
};
