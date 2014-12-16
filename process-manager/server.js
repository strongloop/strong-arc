var express = require('express');
var server = express();
var ProcessManager = require('./process-manager');
var pm = new ProcessManager(process.cwd());

module.exports = server;
server.start = function() {
  // start the pm
  pm.start(function(err) {
    if(err) {
      console.error('Failed to start embedded process manager!');
      console.error(err);
    }
  });
};


server.use(function (req, res) {
  pm.proxyRequest(req, res);
});
