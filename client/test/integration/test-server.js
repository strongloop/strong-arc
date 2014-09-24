var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var studio = require('../../../server/server');
var workspace = studio.workspace;

var SANDBOX = path.resolve(__dirname, 'sandbox');
var STUDIO_ROOT = path.resolve(__dirname, '..', '..', '..');
var EMPTY_PROJECT = path.resolve(STUDIO_ROOT, 'examples', 'empty');

fs.removeSync(SANDBOX);
fs.copySync(EMPTY_PROJECT, SANDBOX);
process.env.WORKSPACE_DIR = SANDBOX;

// karma listens on port 9876 by default
// let's use a similar port number for the Studio server
var port = 9800;

// Inject `POST /reset` to reset the sandbox to initial state
studio.post('/reset', function(req, res, next) {
  console.log('--reset-start--');

  var modelsToReset = workspace.models().filter(function(m) {
    return m !== 'PackageDefinition' && m !== 'Facet' && m !== 'ConfigFile';
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
            entity.removeById(instance.id, cb);
          },
          next);
      });
    },
    function(err) {
      console.log('--reset-done--');
      if (err) next(err);
      res.json({ success: true });
    });
});

workspace.models.Workspace.remoteMethod('reset', {
  http: { verb: 'POST' }
});

// temporary workaround for missing start/stop in loopback-workspace
// see https://github.com/strongloop/loopback-workspace/issues/127
var spawn = require('child_process').spawn;
var child;

function start(cb) {
  if (child) {
    stop(function() {
      start(cb);
    });
    return;
  }
  console.log('--start-begin--');

  try {
    child = spawn(
      process.execPath,
      ['.'],
      {
        cwd: process.env.WORKSPACE_DIR,
        stdio: 'inherit'
      }
    );
  } catch(err) {
    handleError(err);
  }

  child.on('error', handleError);

  // Give the child process few moments to start the HTTP server
  setTimeout(function() {
    console.log('--start-done[pid=%s]--', child.pid);
    done();
  }, 1000);

  child.on('exit', function(code) {
    console.log('Child ' + child.pid + ' exited with code ' + code);
    child = null;
  });

  function done(err) {
    var callback = cb;
    cb = function(){};
    callback(err);
  }

  function handleError(err) {
    console.error('--start-error--', err);
    done(err);
  }
}

function stop(cb) {
  if (!child) {
    process.nextTick(cb);
    return;
  }

  console.log('--stop-begin--');
  child.kill();
  child.on('exit', function() {
    console.log('--stop-done--');
    child = null;
    cb();
  });
}

function createResponseCallback(res) {
  return function(err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: true });
    }
  };
}
studio.post('/start', function(req, res, next) {
  start(createResponseCallback(res));
});

studio.post('/stop', function(req, res, next) {
  stop(createResponseCallback(res));
});

var server = studio.listen(port, function(err) {
  if(err) {
    console.error('Could not start studio!');
    console.error(err);
    process.exit(1);
  }

  console.log('Studio running at http://localhost:%s', server.address().port);
  if (process.argv.length > 2)
    runAndExit(process.argv[2], process.argv.slice(3));
});

function runAndExit(cmd, args) {
  console.log('Running %s %s', cmd, args.join(' '));
  var child = require('child_process').spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', function(err) {
    console.log('child_process.spawn failed', err);
    process.exit(1);
  });
  child.on('exit', function() {
    process.exit();
  });
}
