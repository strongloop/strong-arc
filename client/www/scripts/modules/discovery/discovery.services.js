// Copyright StrongLoop 2014
Discovery.service('DiscoveryService', [
  'DatasourceService',
  '$q',
  'DataSourceDefinition',
  'Datasourcedef',
  '$http',
  '$timeout',
  function(DatasourceService, $q, DataSourceDefinition, Datasourcedef, $http, $timeout) {
    var svc = {};

    svc.getSchemaDataFromDatasource = function(dsId) {
      // use ds name to request schema data
      var isLive = true;

      var deferred = $q.defer();

      if (isLive && dsId) {
        // TODO wire up to ws api and pass ds name

        var dsDef = DataSourceDefinition.findById({id:dsId},
          function(response) {
            dsDef.$prototype$getSchema({id:dsId},
              function(res) {
                deferred.resolve(res.models);
              },
              function(response) {
                console.log('bad get schema defs');
              }
            );
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
    svc.getModelFromSchema = function(dsDef, dsId, table) {
      var deferred = $q.defer();
      $timeout(function(){
        var xyz = dsDef.$prototype$discoverModelDefinition({modelName:table, id:dsId},
          function(response) {
            deferred.resolve(response);
          },
          function(response) {
            console.warn('bad get model from schema');
          }
        );
      }, 2000);

      return deferred.promise;
    }
    /*
    *
    *
    * */
     svc.getModelsFromSchemaSelections = function(dsId, tables) {

       var deferred = $q.defer();

//      // set up a chain of promises based on the number of tables to get schema's for
      var tableName = tables[0].name;
      var dsDef = DatasourceService.getDataSourceById(dsId).
        then(function(response){
          var p = response;
          $timeout(function(){
            var x = p;
            var modelDefinition = svc.getModelFromSchema(x, dsId, tableName).
              then(function(response) {
                deferred.resolve(response);
              });
          },3000);


        });


//      var dsDef = DataSourceDefinition.findById({id:dsId},
//        function(res) {
//          var x = res;
//          var t = x;
//          // slow things down a bit
//
//          dsDef.$prototype$discoverModelDefinition({modelName:tableName}, {id:dsId},
//            function(response) {
//              var tt = 'tt';
//              var p = response;
//              var q = p;
//              console.log('Got the table results: ' + response);
//            },
//            function(response){
//              console.log('bad get table model def.');
//            }
//          );
//        },
//        function(res) {
//          console.log('bad find data source definition by id: ' + dsId);
//        }
//      );
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
