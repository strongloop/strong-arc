var fs = require('fs-extra');
var path = require('path');

module.exports = function(Project) {
  Project.INVALID = 'invalid';
  Project.LOOPBACK = 'loopback';
  Project.NODE = 'node';

  Project.current = function(cb) {
    Project.fromDir(process.cwd(), cb);
  }

  Project.remoteMethod('current', {
    returns: {arg: 'project', type: 'Project', root: true}
  });

  Project.fromDir = function(dir, cb) {
    var project = new Project({dir: dir});
    project.getPackage(function(err, pkg) {
      if(err) return cb(err);
      if(pkg) {
        project.package = pkg;
        project.name = pkg.name
        project.type = Project.NODE;
        if(pkg.dependencies && pkg.dependencies.loopback) {
          project.type = Project.LOOPBACK;
        }
      } else {
        project.type = Project.INVALID;
      }
      project.compatible = project.getCompatibleArcApps();
      cb(null, project);
    });
  }

  Project.prototype.getPackage = function(cb) {
    var packagePath = path.join(this.dir, 'package.json');
    fs.exists(packagePath, function(exists) {
      if(exists) {
        fs.readJson(packagePath, function(err, pkg) {
          if(err && err.name === 'SyntaxError') {
            return cb(null, null);
          } else {
            cb(err, pkg);
          }
        });
      } else {
        cb(null, null);
      }
    });
  }

  Project.prototype.getCompatibleArcApps = function() {
    var project = this;
    var ArcApp = Project.app.models.ArcApp;

    return ArcApp.getAll().filter(function(app) {
      return app.isCompatibleWithProjectType(project.type);
    });
  }
};
