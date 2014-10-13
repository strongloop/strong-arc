// Copyright StrongLoop 2014
BuildDeploy.service('BuildDeployService', [
  '$q',
  '$http',
  function ($q, $http) {
    var svc = this;

    svc.doSomething = function () {
      var def = $q.defer();
      var data = { foo: 'bar' };

      def.resolve(data);

      return def.promise;

//      return $http.get('/')
//        .then(function (res) {
//          var data = res.data;
//
//          return data.something;
//        });
    };

    return svc;
  }
]);
