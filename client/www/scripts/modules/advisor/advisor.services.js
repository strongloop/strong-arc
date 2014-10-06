// Copyright StrongLoop 2014
Advisor.service('AdvisorService', [
  '$q',
  '$http',
  'es',
  function ($q, $http, es) {
    var svc = this;

    /**
     * Get modules
     *
     * Returns a promise.
     */
    svc.getModules = function(obj) {
      return es.search({
        "index" : 'nodeadvisor',
        "type"  : 'npmmodules',
        "body"  : obj
      });
    };

    return svc;
  }
]);
