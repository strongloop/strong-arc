var split = require('split');
var express = require('express');
var spawn = require('child_process').spawn;
var server = express();
var isRunning = false;
var PORT = null;
var pm = null;
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var fs = require('fs-extra');
var path = require('path');

module.exports = server;

server.use(function ensureStarted(req, res, next) {
  if(isRunning) {
    next();
  } else {
    start(next);
  }
});

server.use(function startProxy(req, res, next) {
  req.url = req.url.replace('/process-manager', '/');
  proxy.web(req, res, {
    target: 'http://localhost:' + PORT
  });
});

function start(next) {
  var pathToPm = require.resolve('strong-pm/bin/sl-pm');
  var args = [pathToPm, '--listen', '0'];
  // TODO(ritch) use exec path
  pm = spawn('node', args);
  pm.stdout.pipe(split()).on('data', function(line) {
    console.log(line);
    PORT = parsePort(line);
    if(PORT && !isRunning) {
      isRunning = true;
      removeDir(function(err) {
        if(err) {
          console.error('Error when removing embedded pm dir');
          console.error(err);
        }
        next();
      });
    }
  });
  pm.stderr.pipe(process.stderr);
  pm.once('exit', onExit);
}

function parsePort(line) {
  var match = line.match(/listen on (\d+)/);
  if(match) {
    return match[1];
  }
}

function removeDir(cb) {
  var dir = path.join(process.cwd(), '.strong-pm');
  fs.remove(dir, cb);
}

function onExit(code) {
  console.log('Embedded PM exited with code: %s', code);
  removeDir(noop);
}

function noop() {}
