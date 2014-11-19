// Copyright StrongLoop 2014
BuildDeploy.controller('BuildDeployController', [
  '$scope',
  'BuildDeployService',
  '$log',
  function ($scope, BuildDeployService, $log) {

    $scope.buildId = 'git';
    $scope.deployId = 'new';
    $scope.viewConsole = {
      logs: []
    };

    $scope.build = {
      git: {
        url: '',
        deploy: 'deploy',
        message: ''
      },
      universal: {
        git: '',
        archive: '',
        message: ''
      }
    };

    $scope.deploy = {
      git: {
        url: '',
        deploy: '',
        message: ''
      },
      universal: {
        git: '',
        archive: '',
        message: ''
      },
      host: {
        hostname: '',
        port: '',
        processes: ''
      }
    };

    $scope.buildTogglers = [
      { id: 'git', label: 'Git', activeId: 'buildId' },
      { id: 'universal', label: 'Universal', activeId: 'buildId' }
    ];

    $scope.deployTogglers = [
      { id: 'new', label: 'New', activeId: 'deployId' },
      { id: 'existing', label: 'Existing', activeId: 'deployId' }
    ];

    //set the default active toggler state
    $scope.activeId = $scope.buildTogglers[0].id;

    setUI();
  }
]);
