// Copyright StrongLoop 2014
BuildDeploy.controller('BuildDeployController', [
  '$scope',
  'BuildDeployService',
  '$log',
  function ($scope, BuildDeployService, $log) {

    $scope.buildId = 'git';
    $scope.deployId = 'new';

    $scope.build = {
      git: {
        url: '',
        deploy: ''
      },
      universal: {
        git: '',
        archive: ''
      }
    };

    $scope.deploy = {
      git: {
        url: '',
        deploy: ''
      },
      universal: {
        git: '',
        archive: ''
      },
      host: {
        hostname: '',
        port: '',
        processes: ''
      }
    };

    $scope.logs = [];

    //fake console.log data
    for ( var i = 0, l=10; i < l; i++ ) {
      $scope.logs.push({ msg: 'log line here #' + (i+1) });
    }

    $scope.buildTogglers = [
      { id: 'git', label: 'Git', activeId: 'buildId' },
      { id: 'universal', label: 'Universal', activeId: 'buildId' }
    ];

    $scope.deployTogglers = [
      { id: 'new', label: 'New', activeId: 'deployId' },
      { id: 'existing', label: 'Existing', activeId: 'deployId' }
    ];

    $scope.activeId = $scope.buildTogglers[0].id;

    BuildDeployService.doSomething()
      .then(function (data) {
        $scope.data = data;
      });
  }
]);
