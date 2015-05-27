module.exports = function(ArcApp) {
  var appServer = require('../server');

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
      "id": "build-deploy",
      "name": "Build & Deploy",
      "description": "Build and deploy self-contained app package or Git branch.",
      "disabled": false,
      "supports": ['loopback', 'node']
    },
    {
      "id": "process-manager",
      "name": "Process Manager",
      "description": "Manage your StrongLoop processes.",
      "disabled": false,
      "beta": true,
      "supports": "*"
    },
    {
      "id": "metrics",
      "name": "Metrics",
      "description": "Gather and view application performance metrics.",
      "disabled": false,
      "beta": false,
      "supports": "*"
    },
    {
      "id": "api-analytics",
      "name": "API Analytics",
      "description": "Get detailed information about your API.",
      "disabled": false,
      "featureFlag": "feature:api-analytics",
      "beta": false,
      "supports": "*"
    },
    {
      "id": "tracing",
      "name": "Tracing",
      "description": "Trace through request profiles over time.",
      "disabled": false,
      "beta": true,
      "supports": "*"
    },
    {
      "id": "profiler",
      "name": "Profiler",
      "description": "Profile applications’ CPU and memory consumption.",
      "supports": "*"
    },
    {
      "id": "advisor",
      "name": "Node Advisor",
      "description": "Browse and search curated Node modules with developer reviews.",
      "featureFlag": "feature:advisor",
      "supports": "*"
    }
  ].filter(function(app) {
    if (app.featureFlag) {
      return appServer.enabled(app.featureFlag);
    } else {
      return true;
    }
  }).map(function(app) {
    var arcApp = new ArcApp(app);
    return arcApp;
  });
};
