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

if (argv.indexOf('-h') !== -1 || argv.indexOf('--help') !== -1) {
  printHelp();
  return;
} else if (argv.indexOf('-v') !== -1 || argv.indexOf('--version') !== -1) {
  printVersion();
  return;
}

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

  var url = util.format('http://%s:%s/%s', DEFAULT_STUDIO_HOST,
    server.address().port, '#studio');
  console.log('%s %s', STUDIO_RUNNING_MSG, url);
  if (argv.indexOf('--cli') === -1) {
    opener(url);
  }
});

function getArgv() {
  return process.argv.slice(2);
}

function printHelp() {
  console.log('Usage');
  console.log('  %s [options]', process.env.CMD || 'strong-studio');
  console.log();
  console.log('Options');
  console.log('  --cli   Start the studio backend only, do not open the browser.');
  console.log();
  console.log('The program must be run in the project directory created by');
  console.log('`slc loopback`');
  console.log();
  console.log('StrongLoop Studio will use a different port number each time');
  console.log('you run it. You can provide a specific port number via ');
  console.log('the environment variable PORT, for example:');
  console.log('  PORT=4000 strong-studio');
  console.log();
}

function printVersion() {
  console.log(require('../package.json').version);
}
