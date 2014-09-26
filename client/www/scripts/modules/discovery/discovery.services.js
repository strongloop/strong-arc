// Copyright StrongLoop 2014
Discovery.service('DiscoveryService', [
  'DataSourceService',
  '$q',
  'DataSourceDefinition',
  'Datasourcedef',
  '$http',
  '$timeout',
  function (DataSourceService, $q, DataSourceDefinition, Datasourcedef, $http, $timeout) {
    var svc = this;

    svc.getSchemaDataFromDatasource = function (dsId) {

      return DataSourceDefinition.findById({id: dsId})
        .$promise
        .then(function (datasource) {
          return datasource.$prototype$getSchema({id: dsId})
            .then(function (schema) {
              return schema.models;
            })
            .catch(function (error) {
              console.warn('bad get schema: ' + dsId);
              return error;
            });
        })
        .catch(function(error) {
          console.warn('bad get datasource  ' + error);
        });
    };

    svc.getModelsFromSchemaSelections = function (dsId, tables) {
      var deferred = $q.defer();
      DataSourceService.getDataSourceInstanceById(dsId).
        then(function (dsInstance) {
          var pStack = tables.map(function(table) {
            return new dsInstance.definition.$prototype$discoverModelDefinition({tableName: table.name, id: dsId, options: {schema: table.owner}},
              function(modelDef) {
                return {data:modelDef.status};
              },
              function(error) {
                console.warn('bad discover model: ' + error);
                return error;
              }
            );
          });
          $q.all(pStack).then(function(result) {
            var resolveArray = [];
            angular.forEach(result, function(response) {
              resolveArray.push(response.status);
            });
            deferred.resolve(resolveArray);
          });
        });

      return deferred.promise;
    };
    /*
    *
    *
    *   New Method for directly creating models from schema objects
    *
    * currently not implemented yet in the ui
    * */
    svc.createModelFromSchema = function(dsName, schemaModelObj, selectedProperties) {

      return DataSourceService.getDataSourceInstanceById(dsName)
        .then(function (dataSource) {


          var modelToCreate = schemaModelObj;
          var selectedPropNames = [];
          for (var i = 0;i < selectedProperties.length;i++) {
            selectedPropNames.push(selectedProperties[i].name);
          }

          // remove the unselected model properties
          var propKeys = Object.keys(modelToCreate.properties);
          propKeys.map(function(key) {
            if (selectedPropNames.indexOf(key) === -1) {
              delete modelToCreate.properties[key];
            }
          });

          var commandObj = dataSource.definition;

          return commandObj.$prototype$createModel(modelToCreate)
            .then(function(model) {
              return model;
            });

        });


    };

    // modal window config
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
