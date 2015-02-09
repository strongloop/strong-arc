module.exports = function(ArcApp) {
  var app = require('../server');

  ArcApp.list = function(cb) {
    var all = ArcApp.getAll();
    var Project = ArcApp.app.models.Project;

    Project.current(function(err, currentProject) {
      if(err) return cb(err);
      all.forEach(function(app) {
        if(app.isCompatibleWithProjectType(currentProject.type)) {
          app.supportsCurrentProject = true;
        }
      });
      cb(null, all);
    });
  }

  ArcApp.remoteMethod('list', {
    http: {verb: 'get', path: '/'},
    returns: {arg: 'results', type: ['ArcApp']}
  });

  ArcApp.getAll = function() {
    return ArcApps;
  }

  ArcApp.prototype.isCompatibleWithProjectType = function(type) {
    if(this.supports === '*') {
      return true;
    }
    if(this.supports.indexOf(type) > -1) {
      return true;
    }
    return false;
  }

  var ArcApps = [
    {
      "id": "composer",
      "name": "Composer",
      "description": "Develop and test LoopBack apps, models, and data sources.",
      "supports": ['loopback']
    },
    {
      "id": "profiler",
      "name": "Profiler",
      "description": "Profile applications’ CPU and memory consumption.",
      "supports": "*"
    },
    {
      "id": "build-deploy",
      "name": "Build & Deploy",
      "description": "Build and deploy self-contained app package or Git branch.",
      "disabled": false,
      "supports": ['loopback', 'node']
    },
    {
      "id": "metrics",
      "name": "Metrics",
      "description": "Gather and view application performance metrics.",
      "disabled": false,
      "beta": true,
      "supports": "*"
    },
    {
      "id": "advisor",
      "name": "Node Advisor",
      "description": "Browse and search curated Node modules with developer reviews.",
      "disabled": true,
      "supports": "*"
    },
    {
      "id": "process-manager",
      "name": "Process Manager",
      "description": "Manage your StrongLoop processes.",
      "disabled": false,
      "beta": true,
      "supports": "*"
    }
  ].map(function(app) {
    var arcApp = new ArcApp(app);
    return arcApp;
  });
};
