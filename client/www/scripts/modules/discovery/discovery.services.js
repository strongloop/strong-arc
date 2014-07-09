// Copyright StrongLoop 2014
Discovery.service('DiscoveryService', [
  'DatasourceService',
  '$q',
  'Datasourcedef',
  '$http',
  function(DatasourceService, $q, Datasourcedef, $http) {
    var svc = {};

    svc.getSchemaDataFromDatasource = function(name) {
      // use ds name to request schema data
      var isLive = false;

      var deferred = $q.defer();

      if (isLive) {
        // TODO wire up to ws api and pass ds name
        Datasourcedef.discoverschema({},
          function(response) {

            deferred.resolve(response.schema);

          },
          function(response) {
            console.log('bad get schema defs');
          }
        );
      }
      else {
        // static demo
        var htConfig = {
          method:'GET',
          url:'./scripts/modules/datasource/icars.json'
        };
        $http(htConfig).success(function(response) {
            console.log('datasource schema resolve');
            deferred.resolve(response.schema);
          }).error(function(response) {

          });
      }

      return deferred.promise;

    };
    /*
     *
     * return the particular modal setup for the discovery flow
     *
     * */
    svc.getDiscoveryModalConfig = function(name) {
      return {
        templateUrl: './scripts/modules/discovery/templates/discovery.modal.html',
        windowClass: 'app-modal-window',
        controller: function ($scope, $modalInstance) {

          $scope.targetDiscoveryDSName = name;

          $scope.ok = function () {
            $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: 'lg'
      }
    };
    return svc;
  }

]);
