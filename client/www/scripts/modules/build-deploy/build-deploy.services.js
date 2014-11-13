// Copyright StrongLoop 2014
BuildDeploy.service('BuildDeployService', [
  '$q',
  '$http',
  '$timeout',
  'Build',
  function ($q, $http, $timeout, Build) {
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

      // 1. Build.start();
      Build.start(buildData).$promise
        .then(function(build) {
        // reference the build from teh view if needed
        buildData.build = build;

        // 2. poll for changes
          (function poll() {
          return Build.findById(build.id)
            .then(function(updatedBuild) {
            buildData.build = updatedBuild;
            buildData.logs = updatedBuild.stdout;

            if (updatedBuild.finished) {
              def.resolve(updatedBuild);
            } else {
              $timeout(poll, 5000);
            }
          });
        })();
        }).catch(function(err){
          def.reject(err);
        });

      return def.promise;

      //var def = $q.defer();
      //var data = buildData; //mock response
      //
      //def.resolve(data);
      //
      //return def.promise;
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
