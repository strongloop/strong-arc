Styleguide.controller('StyleguideController', [
  '$scope',
  '$log',
  'StyleguideService',
  '$q',
  function ($scope, $log, StyleguideService, $q) {
    window.setScrollView('.common-instance-view-container');

    $scope.delete = function(){
      $log.log('delete clicked');
    };

    $scope.whatever = function(){
      $log.log('whatever clicked');
    };
  }
]);

