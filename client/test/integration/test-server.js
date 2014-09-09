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
