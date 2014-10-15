// Copyright StrongLoop 2014
BuildDeploy.directive('slBuildForm', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.build-form.html',
      controller: function($scope, $attrs, $log){
        $scope.buildGit = function(form){
          $scope.build.git.submitted = true;
          $log.log(form);
        };

        $scope.buildUniversal = function(form){
          $scope.build.universal.submitted = true;
          $log.log(form);
        };
      },
      link: function(scope, el, attrs){
        scope.$watch('build.git.url', function(newVal){
          scope.deploy.git.url = newVal;
        });

        scope.$watch('build.git.deploy', function(newVal){
          scope.deploy.git.deploy = newVal;
        });

        scope.$watch('build.universal.archive', function(newVal){
          scope.deploy.universal.archive = newVal;
        });
      }
    };
  }
]);

BuildDeploy.directive('slDeployForm', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.deploy-form.html',
      controller: function($scope, $attrs, $log){
        $scope.deployGit = function(form){
          $scope.deploy.git.submitted = true;
          $log.log(form);
        };

        $scope.deployUniversal = function(form){
          $scope.deploy.universal.submitted = true;
          $log.log(form);
//          DeployService.post(deploy.universal)
//            .then(function(data){
//
//            })
        };

        $scope.clickUploadFile = function(e){
          $('[type=file]').click();
        };
      }
    };
  }
]);

BuildDeploy.directive('slBuildDeployNav', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.nav.html'
    }
  }
]);
