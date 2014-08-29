#!/usr/bin/env node
var path = require('path');
var util = require('util');
var opener = require('opener');
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

console.log('Loading workspace %s', process.env.WORKSPACE_DIR);

var port = process.env.PORT || 0;

var server = studio.listen(port, function(err) {
  if(err) {
    console.error('could not start studio!');
    console.error(err);
    process.exit(1);
  }

  var url = util.format('http://%s:%s', DEFAULT_STUDIO_HOST,
    server.address().port);
  console.log('%s %s', STUDIO_RUNNING_MSG, url);
  if (argv.indexOf('--cli') === -1) {
    opener(url);
  }
});

function getArgv() {
  return process.argv.slice(2);
}
