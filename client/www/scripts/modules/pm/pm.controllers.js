// Copyright StrongLoop 2014
PM.controller('PMAppController', [
  '$scope',
  '$log',
  'PMAppService',
  function($scope, $log, PMAppService) {

    $scope.isLocalApp = true;
    $scope.isLocalAppRunning = false;

    $scope.startApp = function() {
      PMAppService.startLocalApp()
        .then(function(response) {
          $log.debug('App Started = woot: ' + response);
        });
    };
    $scope.stopApp = function() {
      PMAppService.stopLocalApp()
        .then(function(response) {
          $log.debug('App Stopped = woot: ' + response);
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
