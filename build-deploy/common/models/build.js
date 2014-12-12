var sl_build = require.resolve('strong-build/bin/slb');
var split = require('split');
var spawn = require('child_process').spawn;
var path = require('path');

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

    var buildProcess = spawn(process.execPath, args);
    processes[build.id] = buildProcess;

    build.handleOutput('out', buildProcess.stdout);
    build.handleOutput('err', buildProcess.stderr);

    buildProcess.on('exit', function(errCode) {
      delete processes[build.id];
      Build.findById(build.id, function(err, build) {
        if(err) {
          build.error = err.toString();
        }
        build.archive = build._parseArchivePath();
        build.finished = new Date();
        if(errCode) {
          build.errorCode = errCode;
        }
        build.save();
      });
    });

    build.save(cb);
  }

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
