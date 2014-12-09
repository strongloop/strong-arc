// Copyright StrongLoop 2014
PM.controller('PMAppController', [
  '$scope',
  '$log',
  'PMAppService',
  function($scope, $log, PMAppService) {

    $scope.isLocalApp = true;
    $scope.isLocalAppRunning = false;
    $scope.runningState = 'not running';

    $scope.startApp = function() {
      PMAppService.startLocalApp()
        .then(function(response) {
          $log.debug('App Started = woot: ' + response);
        });
    };
    $scope.getLocalAppLink = function() {
      PMAppService.getLocalAppUrl()
        .then(function(response) {
          $scope.localAppLink = response;
          $scope.runningState = 'running';
        });
    };

    $scope.reStartApp = function() {
      PMAppService.restartLocalApp()
        .then(function(response) {
          $log.debug('App re-started: ' + response);
        });
    };

    $scope.stopApp = function() {
      PMAppService.stopLocalApp()
        .then(function(response) {
          $log.debug('App Stopped : ' + response);
        });
    };
    $scope.isAppRunning = function() {
      PMAppService.isLocalAppRunning()
        .then(function(response) {
          $log.debug('App running?: ' + response);
        });
    };
  }
]);
