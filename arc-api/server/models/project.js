var fs = require('fs-extra');

module.exports = function(Project) {
  Project.INVALID = 'invalid';
  Project.LOOPBACK = 'loopback';
  Project.NODE = 'node';

  Project.current = function(cb) {
    Project.fromDir(process.cwd(), cb);
  }

  Project.fromDir = function(dir, cb) {
    var project = new Project({dir: dir});
    var pkg = project.getPackagePath();
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
      project.supports = project.getSupportedComponents();
      cb(null, project);
    });
  }

  Project.prototype.getPackage = function(cb) {
    var packagePath = path.join(this.dir, 'package.json');
    fs.exists(packagePath, function(exists) {
      if(exists) {
        fs.readJson(packagePath, cb);
      } else {
        cb(null, null);
      }
    });
  }
};
