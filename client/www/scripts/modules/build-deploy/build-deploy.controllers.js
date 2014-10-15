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
      host: { hostname: '', port: '', processes: '' }
    };

    $scope.$watch('build.git.url', function(newVal){
      $scope.deploy.git.url = newVal;
    });

    $scope.$watch('build.git.deploy', function(newVal){
      $scope.deploy.git.deploy = newVal;
    });

    $scope.$watch('build.universal.archive', function(newVal){
      $scope.deploy.universal.archive = newVal;
    });

    $scope.showGit = function(){
      $log.log('clicked showGit()');
    };

    $scope.showUniversal = function(){
      $log.log('clicked showUniversal()');
    };

    //todo click events may not be needed here
    $scope.buildTogglers = [
      { id: 'git', label: 'Git', click: $scope.showGit, activeId: 'buildId' },
      { id: 'universal', label: 'Universal', click: $scope.showUniversal, activeId: 'buildId' }
    ];

    //todo click events may not be needed here
    $scope.deployTogglers = [
      { id: 'new', label: 'New', click: $scope.showNew, activeId: 'deployId' },
      { id: 'existing', label: 'Existing', click: $scope.showExisting, activeId: 'deployId' }
    ];

    $scope.activeId = $scope.buildTogglers[0].id;

    $scope.clickUploadFile = function(e){
      $('[type=file]').click();
    };

    $scope.buildGit = function(form){
      $scope.build.git.submitted = true;
      $log.log(form);
    };

    $scope.buildUniversal = function(form){
      $scope.build.universal.submitted = true;
      $log.log(form);
    };

    $scope.deployGit = function(form){
      $scope.deploy.git.submitted = true;
      $log.log(form);
    };

    $scope.deployUniversal = function(form){
      $scope.deploy.universal.submitted = true;
      $log.log(form);
    };


    BuildDeployService.doSomething()
      .then(function (data) {
        $scope.data = data;
      });
  }
]);
