// Copyright StrongLoop 2014
Landing.service('LandingService', [
  '$q',
  '$http',
  function ($q, $http) {
    var svc = {};

    svc.getApps = function () {
      return $http.get('./scripts/modules/landing/landing.data.json')
        .then(function (res) {
          var data = res.data;

          return data.apps;
        });
    };

    return svc;
  }
]);
