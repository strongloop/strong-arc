// Copyright StrongLoop 2014
Landing.service('LandingService', [
  '$q',
  'ArcApp',
  'Project',
  'ARC-PROJECTS-ENABLED',
  function ($q, ArcApp, Project, arcProjectsEnabled) {
    var svc = this;

    svc.getApps = function() {
      return ArcApp.list();
    };

    svc.getCurrentProject = function() {
      if (arcProjectsEnabled) {
        return Project.current();
      } else {
        var deferred = $q.defer();
        deferred.resolve(null);
        return deferred.promise;
      }
    };

    return svc;
  }
]);
