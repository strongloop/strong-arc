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
      $scope.showChartDataLoading = true;
      $scope.isLoading = false;

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
        $scope.showChartDataLoading = true;
        var def = $q.defer();

        if (!$scope.isLoading) {
          $scope.isLoading = true;
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
              $scope.showChartDataLoading = false;
              $scope.isLoading = false;
              def.resolve($scope.apiChart);
            })
            .catch(function(error) {
              $log.warn('bad get chart data: ', error);
              $scope.showChartDataLoading = false;
              $scope.isLoading = false;
            })
            .finally(function() {
              $scope.showChartDataLoading = false;
              $scope.isLoading = false;
            });

        }

        return def.promise;
      };

      $scope.init();
    }]);
