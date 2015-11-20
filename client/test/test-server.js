var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var _defaults = require('lodash').defaults;

process.env.SL_ARC_FEATURE_FLAGS = 'tracing';

var given = require('loopback-workspace/test/helpers/given');

var SANDBOX = path.resolve(__dirname, 'sandbox');
var ARC_ROOT = path.resolve(__dirname, '..',  '..');
var EMPTY_PROJECT = path.resolve(ARC_ROOT, 'examples', 'empty');

fs.removeSync(SANDBOX);
fs.copySync(EMPTY_PROJECT, SANDBOX);
process.env.WORKSPACE_DIR = SANDBOX;

// Use a random port to avoid conficts when running tests in parallel.
var port = 0;

var sandboxNeedsFullReset = false;

var arc = require('../../server/server');
var workspace = arc.workspace;

function resetSandbox(req, res, next) {
  console.log('--reset-sandbox--');
  if (!sandboxNeedsFullReset) {
    return next();
  }
  fs.remove(SANDBOX, function(err) {
    if (err) {
      return next(err);
    }
    fs.copy(EMPTY_PROJECT, SANDBOX, function(err) {
      sandboxNeedsFullReset = false;
      return next(err);
    });
  });
}

// Inject `POST /reset` to reset the sandbox to initial state
arc.post('/reset', resetSandbox, function(req, res, next) {
  console.log('--reset-start--');

  var modelsToReset = workspace.models().filter(function(m) {
    return [
      'PackageDefinition',
      'Facet',
      'ConfigFile',
      'Workspace'
    ].indexOf(m.modelName) === -1;
  });

  async.eachSeries(
    modelsToReset,
    function(entity, next) {
      // `destroyAll` does not remove JSON files
      // we have to use `removeById` instead
      entity.find(function(err, list) {
        async.eachSeries(
          list,
          function(instance, cb) {
            if (instance.readonly) {
              return cb();
            }
            entity.removeById(instance.id, cb);
          },
          next);
      });
    },
    function(err) {
      console.log('--reset-done--');
      if (err) return next(err);
      res.json({ success: true });
    });
});

arc.post('/delete-facet/:facetName', function(req, res, next) {
  console.log('--delete-facet-start--');
  var facetName = req.params.facetName;
  fs.remove(
    path.resolve(SANDBOX, req.params.facetName),
    function(err) {
      console.log('--delete-facet-done--');
      sandboxNeedsFullReset = true;
      if (err) return next(err);
      res.json({ success: true });
    });
});

arc.post('/given/unique-server-port', function(req, res, next) {
  given.uniqueServerPort(function(err, configEntry) {
    if (err) return next(err);
    res.json({ succcess: true, port: configEntry.value });
  });
});

workspace.models.Workspace.remoteMethod('reset', {
  http: { verb: 'POST' }
});

var server = arc.listen(port, function(err) {
  if(err) {
    console.error('Could not start arc!');
    console.error(err);
    process.exit(1);
  }

  console.log('Arc running at http://localhost:%s', server.address().port);
  if (process.send) {
    process.send(server.address());
  }
  if (process.argv.length > 2)
    runAndExit(process.execPath, process.argv.slice(2), server.address().port);
});

function runAndExit(cmd, args, serverPort) {
  console.log('Running %s %s', cmd, args.join(' '));
  var child = require('child_process').spawn(cmd, args, {
    stdio: 'inherit',
    env: _defaults({}, process.env, {
      TEST_SERVER_PORT: serverPort
    })
  });
  child.on('error', function(err) {
    console.log('child_process.spawn failed', err);
    process.exit(1);
  });
  child.on('exit', function(code) {
    process.exit(code);
  });
}
