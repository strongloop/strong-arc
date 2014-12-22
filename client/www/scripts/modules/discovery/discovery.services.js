// Copyright StrongLoop 2014
Discovery.service('DiscoveryService', [
  'DataSourceService',
  '$q',
  'DataSourceDefinition',
  function (DataSourceService, $q, DataSourceDefinition) {
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
          console.warn('bad get data source  ' + error);
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
    *   New Method for directly creating models from schema objects
    *
    * */
    svc.createModelFromSchema = function(dsId, schemaModelObj, selectedProperties) {

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

      return DataSourceDefinition.prototype$createModel({id: dsId}, {discoveredDef: modelToCreate})
        .$promise
        .then(function(response) {
          return response.modelDefinitionId;
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
