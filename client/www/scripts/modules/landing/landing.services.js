// Copyright StrongLoop 2014
Landing.service('LandingService', [
  '$q',
  '$http',
  function ($q, $http) {
    var svc = this;

    svc.getApps = function () {
      return $http.get('./scripts/modules/landing/landing.data.json')
        .then(function (res) {
          var data = res.data;
          var apps = data.apps.filter(function(app){
            return !app.disabled;
          });

          return apps;
        });
    };

    return svc;
  }
]);
