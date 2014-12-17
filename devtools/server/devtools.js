var express = require('express');
var path = require('path');
var ws = require('ws');

var DevToolsBackend = require('./backend');

var app = module.exports = express();

app.setupWebSocketServer = function(httpServer) {
  var wsServer = ws.createServer({
    server: httpServer,
    path: app.path() + '/ws'
  });
  wsServer.on('connection', function onConnection(socket) {
    new DevToolsBackend().serve(socket);
  });

  wsServer.on('error', function onError(err) {
    console.warn('**warn** WebSocketServer error', err);
  });
};

app.use(express.static(projectPath('custom')));
app.use(express.static(projectPath('prefixed')));
app.use(express.static(projectPath('frontend'), { index: 'inspector.html' }));

function projectPath() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('..');
  args.unshift(__dirname);
  return path.resolve.apply(path, args);
}
