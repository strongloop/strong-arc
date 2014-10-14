// Copyright StrongLoop 2014
BuildDeploy.controller('BuildDeployController', [
  '$scope',
  'BuildDeployService',
  '$log',
  function ($scope, BuildDeployService, $log) {

    $scope.buildId = 'git';
    $scope.deployId = 'new';

    $scope.showGit = function(){
      $log.log('clicked showGit()');
    };

    $scope.showUniversal = function(){
      $log.log('clicked showUniversal()');
    };

    $scope.buildTogglers = [
      { id: 'git', label: 'Git', click: $scope.showGit, activeId: 'buildId' },
      { id: 'universal', label: 'Universal', click: $scope.showUniversal, activeId: 'buildId' }
    ];

    $scope.deployTogglers = [
      { id: 'new', label: 'New', click: $scope.showNew, activeId: 'deployId' },
      { id: 'existing', label: 'Existing', click: $scope.showExisting, activeId: 'deployId' }
    ];

    $scope.activeId = $scope.buildTogglers[0].id;

    $scope.clickUploadFile = function(e){
      $('[type=file]').click();
    };

    BuildDeployService.doSomething()
      .then(function (data) {
        $scope.data = data;
      });
  }
]);
