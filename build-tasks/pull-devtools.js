var async = require('async');
var fs = require('fs-extra');
var gutil = require('gulp-util');
var path = require('path');
var svn = require('svn-interface');

module.exports = function(DEVTOOLS_DIR, callback) {
  var REPO_URL = 'http://src.chromium.org/blink/branches/chromium';
  var FRONTEND_DIR = path.resolve(DEVTOOLS_DIR, 'frontend');
  var PROTOCOL_FILE = path.resolve(DEVTOOLS_DIR, 'protocol.json');

  var latestBranch;

  async.series([
    fetchLatestBranchId,
    removeOldFiles,
    fetchBranchFiles,
    writeVersionFile,
    generateProtocolCommands,
  ], function(err) {
    callback(err);
  });

  function fetchLatestBranchId(cb) {
    svn.list(REPO_URL, function(err, result) {
      if (err) return callback(err);
      var branches = result.lists.list.entry
        // get the branch id (number)
        .map(function(e) {
          return +e.name._text;
        })
        // filter out non-numbers
        .filter(function(n) {
          return n;
        });

      latestBranch = Math.max.apply(Math, branches);
      gutil.log('Using branch', gutil.colors.yellow(latestBranch));
      cb();
    });
  }

  function removeOldFiles(cb) {
    fs.remove(FRONTEND_DIR, function(err) {
      if (err) cb(err);
      fs.remove(PROTOCOL_FILE, cb);
    });
  }

  function fetchBranchFiles(cb) {
    var branchUrl = REPO_URL + '/' + latestBranch;
    var devtoolsUrl = branchUrl + '/Source/devtools';

    gutil.log('Pulling front_end files...');
    svn.export(
      [devtoolsUrl + '/front_end', FRONTEND_DIR],
      function(err, result) {
        if (err) return cb(new Error('SVN failed: ' + result));
        gutil.log('Pulling protocol.json');
        svn.export(
          [devtoolsUrl + '/protocol.json', DEVTOOLS_DIR],
          function(err, result) {
            if (err) return cb(new Error('SVN failed: ' + result));
            cb();
          });
      });
  }

  function writeVersionFile(cb) {
    gutil.log('Writing version file');
    fs.writeFile(
      path.resolve(FRONTEND_DIR, 'version.txt'),
        'Branch: ' + latestBranch + '\nRepository: ' + REPO_URL,
      'utf-8',
      cb);
  }

  function generateProtocolCommands(cb) {
    gutil.log('Generating InspectorBackendCommands.js');
    var vm = require('vm');
    fs.readJsonFile(PROTOCOL_FILE, function(err, protocol) {
      if (err) return cb(err);

      function evalFile(filePath) {
        filePath = path.resolve(FRONTEND_DIR, filePath);
        var source = fs.readFileSync(filePath, 'utf8');
        vm.runInThisContext(source, filePath);
      }

      // TODO(bajtos) Evaluate all scripts in a new context
      /*global self:true, WebInspector:true, window:true */
      self = {};
      WebInspector = {};
      window = global;

      // TODO(bajtos) Rework to async code(?)
      try {
        evalFile('common/object.js');
        evalFile('common/utilities.js');
        evalFile('sdk/InspectorBackend.js');
      } catch (e) {
        return cb(e);
      }

      /*global InspectorBackendClass */
      var commands = InspectorBackendClass._generateCommands(protocol);
      var header = '// Auto-generated.\n' +
        '// Run `gulp pull-devtools` to update.\n' +
        '\n';

      fs.writeFile(
        path.resolve(FRONTEND_DIR, 'InspectorBackendCommands.js'),
          header + commands,
        'utf8',
        cb);
    });
  }
};
