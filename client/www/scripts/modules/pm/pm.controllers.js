// Copyright StrongLoop 2014
PM.controller('PMAppController', [
  '$scope',
  '$log',
  'PMAppService',
  function($scope, $log, PMAppService) {

    $scope.startApp = function() {
      PMAppService.restartLocalApp()
        .then(function() {
          $log('App Started = woot');
        });
    }
  }
]);
