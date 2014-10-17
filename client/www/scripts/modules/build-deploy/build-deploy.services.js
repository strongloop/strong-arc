// Copyright StrongLoop 2014
BuildDeploy.service('BuildDeployService', [
  '$q',
  '$http',
  function ($q, $http) {
    var svc = this;

    svc.buildGit = function (buildData) {
      var def = $q.defer();
      var data = buildData; //mock response

      def.resolve(data);

      return def.promise;

//      return $http.get('/')
//        .then(function (res) {
//          var data = res.data;
//
//          return data.something;
//        });
    };

    svc.buildUniversal = function(buildData){
      var def = $q.defer();
      var data = buildData; //mock response

      def.resolve(data);

      return def.promise;
    };

    svc.deployGit = function(data){
      var def = $q.defer();
      var data = { foo: 'bar' };

      def.resolve(data);

      return def.promise;
    };

    svc.deployUniversal = function(data){
      var def = $q.defer();
      var data = { foo: 'bar' };

      def.resolve(data);

      return def.promise;
    };

    return svc;
  }
]);
