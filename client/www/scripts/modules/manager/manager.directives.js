Manager.directive('slManagerHostName', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.host.name.html',
      controller: ['$scope',  function($scope) {

        $log.debug('Manager Host Name Controller');

        //used by existing host row
        $scope.onPMServerSelectAutoCompleted = function(item, model){
          $scope[model].host = item.host;
          $scope[model].port = item.port;
        };
      }]
    }
  }
]);
Manager.directive('slManagerHostPort', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.host.port.html'
    }
  }
]);
Manager.directive('slManagerStatus', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.status.html'
    }
  }
]);
Manager.directive('slManagerProcessCount', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.process.count.html'
    }
  }
]);
Manager.directive('slManagerProcessList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.process.list.html'
    }
  }
]);
Manager.directive('slManagerHostProblemMessage', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.host.problem.html'
    }
  }
]);
Manager.directive('slManagerHostActivate', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.host.activate.html'
    }
  }
]);
Manager.directive('slManagerLoadBalancer', [
  '$log',
  '$rootScope',
  function($log, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/manager/templates/manager.load.balancer.html',
      link: function(scope, el, attrs){


        $rootScope.$on('pageClick', function(e, $event){
          var isMenuClick = !!$($event.target).parents('.load-balancer-content').length;
          var isTriggerClick = $($event.target).hasClass('link-cmd');

          if ( !isMenuClick && !isTriggerClick ) {
            scope.showManagerLoadBalancer = false;
          }
        });

      }
    }
  }
]);
