#!/usr/bin/env node
var path = require('path');
var util = require('util');
var opener = require('opener');
var DEFAULT_ARC_HOST = 'localhost';
var STRONG_ARC_RUNNING_MSG =
exports.STRONG_ARC_RUNNING_MSG = 'StrongLoop Arc is running here:';
var argv = getArgv();
var pathArg = argv[0];
var WORKSPACE_DIR = process.cwd();

if (argv.indexOf('-h') !== -1 || argv.indexOf('--help') !== -1) {
  printHelp();
  return;
} else if (argv.indexOf('-v') !== -1 || argv.indexOf('--version') !== -1) {
  printVersion();
  return;
}

var arc = require('../server/server');

if(pathArg) {
  WORKSPACE_DIR = path.join(WORKSPACE_DIR, pathArg);
}

process.env.WORKSPACE_DIR = process.env.WORKSPACE_DIR || WORKSPACE_DIR;

console.log('Loading workspace %s', process.env.WORKSPACE_DIR);

var port = process.env.PORT || 0;

delete process.env.PORT;

var server = arc.listen(port, function(err) {
  if(err) {
    console.error('could not start Arc!');
    console.error(err);
    process.exit(1);
  }

  var url = util.format('http://%s:%s/%s', DEFAULT_ARC_HOST,
    server.address().port, '#/');

  console.log('%s %s', STRONG_ARC_RUNNING_MSG, url);

  if (argv.indexOf('--cli') === -1) {
    opener(url);
  }
});

function getArgv() {
  return process.argv.slice(2);
}

function printHelp() {
  var cmd = process.env.CMD || 'strong-arc';
  console.log('Usage');
  console.log('  %s [options]', cmd);
  console.log();
  console.log('Options');
  console.log('  --cli   Start the backend only, do not open the browser.');
  console.log();
  console.log('StrongLoop Arc will use a different port number each time');
  console.log('you run it. You can provide a specific port number via ');
  console.log('the environment variable PORT, for example:');
  console.log('  PORT=4000 ' + cmd);
  console.log();
}

function printVersion() {
  console.log(require('../package.json').version);
}
