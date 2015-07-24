ApiAnalytics.controller('ApiAnalyticsController', [
    '$scope',
    '$state',
    '$log',
    '$q',
    '$interval',
    '$timeout',
    'ApiAnalyticsService',
    'LicensesService',
    function($scope, $state, $log, $q, $interval, $timeout, ApiAnalyticsService, LicensesService) {
      $scope.apiChart = {};
      $scope.server = {};

      window.setScrollView('.common-instance-view-container');

      $scope.init = function(){
        LicensesService.validateModuleLicense('api-analytics', 'arc')
          .catch(function(err){
            $log.error(err);
          });
      };

      $scope.updateHost = function(host) {
        $scope.server = host;
        $scope.apiChart = {};
        $scope.getData(null, 0, 0);
      };

      $scope.getData = function(d, i, depth, initialModel){
        var def = $q.defer();

        ApiAnalyticsService.getApiAnalyticsChartDataByNode(d, i, depth, $scope.server, initialModel)
          .then(function(data){
            var allData = {};

            angular.extend(allData, data);

            var chart = {
              data: data,
              node: d,
              nodeIdx: i,
              allData: allData
            };

            $scope.apiChart = chart;

            def.resolve($scope.apiChart);
          });

        return def.promise;
      };

      $scope.init();
    }]);
