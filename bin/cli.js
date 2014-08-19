#!/usr/bin/env node
var path = require('path');
var studio = require('../server/server');
var DEFAULT_STUDIO_HOST = 'localhost';
var STUDIO_RUNNING_MSG = 
exports.STUDIO_RUNNING_MSG = 'Your studio is running here:';
var argv = getArgv();
var pathArg = argv[0];
var WORKSPACE_DIR = process.cwd();

if(pathArg) {
  WORKSPACE_DIR = path.join(WORKSPACE_DIR, pathArg);
}

process.env.WORKSPACE_DIR = process.env.WORKSPACE_DIR || WORKSPACE_DIR;

var port = process.env.PORT || 0;

var server = studio.listen(port, function(err) {
  if(err) {
    console.error('could not start studio!');
    console.error(err);
  }

  console.log('%s http://%s:%s',
    STUDIO_RUNNING_MSG, DEFAULT_STUDIO_HOST,
    server.address().port);
});

function getArgv() {
  var argv = process.argv.splice(); // copy
  argv.shift(); // remove command
  return argv;
}
