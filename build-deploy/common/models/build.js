var assert = require('assert');
var debug = require('debug')('strong-arc:build-deploy:build');
var path = require('path');
var sl_build = require.resolve('strong-build/bin/sl-build');
var spawn = require('child_process').spawn;
var split = require('split');

module.exports = function(Build) {
  var processes = {};

  Build.start = function(build, cb) {
    Build.create(build, function(err, newBuild) {
      if(err) return cb(err);
      startBuild(newBuild, cb);
    });
  }

  Build.remoteMethod('start', {
    accepts: {arg: 'build', type: 'Build', http: {source: 'body'}},
    returns: {arg: 'build', type: 'Build', root: true},
    http: {verb: 'post', path: '/start'}
  });

  Build.prototype.handleOutput = function(type, stream) {
    var build = this;
    var output = [];
    stream.pipe(split()).on('data', function(line) {
      debug('std%s: %s', type, line);
      output.push(line);
      build['std' + type] = output;
      build.save();
    });
  }

  Build.prototype.getProcess = function() {
    return processes[this.id];
  }

  Build.prototype.cancel = function(cb) {
    var proc = this.getProcess();
    if(proc) {
      proc.exit();
    }
    this.canceled = true;
    this.save(cb);
  }

  function startBuild(build, cb) {
    var args = [ sl_build ];
    build.started = new Date();

    args.push('--install');
    
    switch(build.type) {
      case 'git':
        args.push('--commit');
        args.push('--onto');
        args.push(build.branch || 'deploy');
      break;
      default:
        build.type = 'universal';
        if(!build.skipBundle) {
          args.push('--bundle');
        }
        args.push('--pack');
      break;
    }

    debug('spawn: %j', args);

    var buildProcess = spawn(process.execPath, args);

    processes[build.id] = buildProcess;

    build.handleOutput('out', buildProcess.stdout);
    build.handleOutput('err', buildProcess.stderr);

    buildProcess.on('error', function(err) {
      debug('spawn errored: %s', err);

      // Not a code... but best we can do without changing Build schema.
      var errorCode = err.message;

      finish(errorCode);
    });

    buildProcess.on('exit', function(status, signal) {
      var errorCode = signal || status;

      debug('child %d exit: %s', buildProcess.pid, errorCode);

      // Don't set on status 0, that's success, anything else is an error.
      if (!errorCode) {
        errorCode = undefined;
      }

      finish(errorCode, build._parseArchivePath());
    });

    function finish(errorCode, archive) {
      delete processes[build.id];

      build.archive = archive;
      build.finished = new Date();
      // Don't set on status 0, that's success, anything else is an error.
      if(errorCode) {
        build.errorCode = errorCode;
      }
      build.save();
    }

    build.save(cb);
  }

  // XXX This is fragile and unnecessary, implement a --dest option for
  // sl-build, or just construct:
  //   p = require(path.resolve('package.json'))
  //   name = '../' + p.name + '-' + p.version + '.tgz';
  Build.prototype._parseArchivePath = function() {
    var line;
    var ROOT = process.cwd();
    for(var i = 0; i < this.stdout.length; i++) {
      line = this.stdout[i];
      if(typeof line === 'string') {
        match = line.match(/mv -f (\S+\.tgz)\s/);
        if(match) {
          return path.join(ROOT, '..', match[1]);
        }
      }
    }
  }
}
