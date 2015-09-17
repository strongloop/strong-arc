// Copyright StrongLoop 2014
BuildDeploy.controller('BuildDeployController', [
  '$scope',
  'BuildDeployService',
  '$log',
  'PackageDefinition',
  '$state',
  function ($scope, BuildDeployService, $log, PackageDefinition, $state) {

    $scope.pkg = PackageDefinition.findOne().$promise
      .then(function(pkg){
        $scope.pkg = pkg;
      }).catch(function(err) {
        $log.warn('Cannot get project\'s package definition.', err);
        $scope.pkg = {};
      });

    $scope.goToAddPM = function() {
      $state.go('process-manager');
    };

    $scope.buildId = 'universal';
    $scope.deployId = 'new';
    $scope.viewConsole = {
      logs: []
    };

    $scope.build = {
      git: {
        url: '',
        deploy: 'deploy',
        message: '',
        messageType: 'success'
      },
      universal: {
        git: '',
        archive: '',
        message: '',
        messageType: 'success'
      }
    };

    $scope.deploy = {
      git: {
        url: '',
        deploy: '',
        message: '',
        messageType: 'success'
      },
      universal: {
        git: '',
        archive: '',
        message: '',
        messageType: 'success'
      },
      host: {
        hostname: '',
        port: '',
        processes: ''
      }
    };

    $scope.buildTogglers = [
      { id: 'universal', label: 'Tar file', activeId: 'buildId' },
      { id: 'git', label: 'Git', activeId: 'buildId' }
    ];

    $scope.deployTogglers = [
      { id: 'new', label: 'New', activeId: 'deployId' },
      { id: 'existing', label: 'Existing', activeId: 'deployId' }
    ];

    //set the default active toggler state
    var defaultActiveToggler = $scope.buildTogglers[0];
    $scope.activeId = defaultActiveToggler.id;
    defaultActiveToggler.isActive = true;

    $scope.populateDeployArchive = function(pkg) {
      if (pkg) {
        var localPath = '../' + $scope.pkg.name + '-' + $scope.pkg.version + '.tgz';
        $scope.deploy.universal.archive = localPath;

      }
    };

    setUI();
  }
]);
