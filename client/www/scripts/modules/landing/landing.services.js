// Copyright StrongLoop 2014
Landing.service('LandingService', [
  '$q',
  'ArcApp',
  'Project',
  function ($q, ArcApp, Project) {
    var svc = this;

    svc.getApps = function() {
      return ArcApp.list();
    };

    svc.getCurrentProject = function() {
      return Project.current();
    };

    return svc;
  }
]);
