// Copyright StrongLoop 2014
BuildDeploy.service('BuildDeployService', [
  '$q',
  '$http',
  '$log',
  '$timeout',
  '_',
  'Build',
  'Deployment',
  function ($q, $http, $log, $timeout, _, Build, Deployment) {
    var svc = this;

    // 2. poll for changes
    function poll(def, buildData, build, viewConsole) {
      $log.log(build);
      return Build.findById({id: build.id}).$promise
        .then(function(updatedBuild) {
          buildData.build = updatedBuild;

          viewConsole.logs = viewConsole.logs.concat(updatedBuild.stdout, updatedBuild.stderr);
          viewConsole.logs = _.uniq(viewConsole.logs);

          if (updatedBuild.finished) {
            if (updatedBuild.errorCode)
              def.reject(updatedBuild);
            else
              def.resolve(updatedBuild);
          } else {
            $timeout(function(){
              poll(def, buildData, build, viewConsole);
            }, 2000);
          }
        });
    }

    // 1. start build
    function startBuild(buildData, viewConsole){
      var def = $q.defer();

      // 1. Build.start();
      Build.start(buildData).$promise
        .then(function(build) {
          // reference the build from the view if needed
          buildData.build = build;
          viewConsole.logs.push('STARTING BUILD....');
          viewConsole.logs = viewConsole.logs.concat(build.stdout, build.stderr);
          viewConsole.logs = _.uniq(viewConsole.logs);

          $log.log(1, build);
          poll(def, buildData, build, viewConsole);
        }).catch(function(err){
          viewConsole.logs = viewConsole.logs.concat(err.stderr);
          viewConsole.logs = _.uniq(viewConsole.logs);
          def.reject(err);
        });

      return def.promise;
    }


    //create a deploy using Deployment service
    function startDeploy(deployData, viewConsole){
      return Deployment.create(deployData).$promise;
    }

    //build
    svc.buildGit = startBuild;
    svc.buildUniversal = startBuild;

    //deploy
    svc.deployGit = startDeploy;
    svc.deployUniversal = startDeploy;

    return svc;
  }
]);
