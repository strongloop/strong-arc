#!/usr/bin/env node
var path = require('path');
var util = require('util');
var opener = require('opener');
var minimist = require('minimist');
var DEFAULT_ARC_HOST = 'localhost';
var STRONG_ARC_RUNNING_MSG =
exports.STRONG_ARC_RUNNING_MSG = 'StrongLoop Arc is running here:';
var opts = minimist(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
  },
  boolean: [
    'licenses',
    'version',
    'help',
    'cli',
  ],
  string: [
    'feature',
    'features',
  ],
});

var argv = getArgv();
var pathArg = opts._[0];
var WORKSPACE_DIR = process.cwd();

if (opts.help) {
  return printHelp();
} else if (opts.version) {
  return printVersion();
}

// --features foo,bar --feature baz --feature quux
//  => {feaures: 'foo,bar', feature: ['baz', 'quux']}
//  => ['foo', 'bar', 'baz', 'quux']
var features = [].concat(opts.feature, opts.features).map(function(f) {
  return f && f.split(',');
}).reduce(function(acc, f) {
  return f ? acc.concat(f) : acc;
}, []);
process.env.SL_ARC_FEATURE_FLAGS = features.join(path.delimiter);

var arc = require('../server/server');

if (pathArg) {
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

  //add optional path if flag is passed
  var path = '#/' + ( opts.licenses ? 'licenses' : '' );
  var url = util.format('http://%s:%s/%s', DEFAULT_ARC_HOST,
    server.address().port, path);

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
