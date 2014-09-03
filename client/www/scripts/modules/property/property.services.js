// Copyright StrongLoop 2014
Property.service('PropertyService', [
  'ModelDefinition',
  'ModelProperty',
  'ModelService',
  '$q',
  function(ModelDefinition, ModelProperty, ModelService, $q) {
    var svc = {};

    svc.getModelProperties = function(modelId) {
      var deferred = $q.defer();
      ModelProperty.properties({id:modelId},
        //success
        function(response) {
          return deferred.resolve(response);
        },
        // fail
        function(response) {
          console.warn('bad get model properties: ' + response);
        }

      );
      return deferred.promise
    };
    svc.createModelProperty = function(propConfig) {
      return ModelProperty.create({}, propConfig)
        .$promise
        .then(function(property) {
          return property;
        })
        .catch(function(error) {
          console.warn('bad create model property: ' + error);
          return error;
        });
    };

    svc.updateModelProperty = function(propConfig) {
      var deferred = $q.defer();

      // `id` is '{facet}.{model}.{name}'
      var oldName = propConfig.id.split('.').pop();

      // Temporary workaround until loopback-workspace supports renames
      if (oldName === propConfig.name) {
        ModelProperty.upsert({}, propConfig,
          //success
          function(response) {
            return deferred.resolve(response);
          },
          // fail
          function(response) {
            console.warn('bad get model properties: ' + response);
          }
        );
      } else {
        var oldId = propConfig.id;
        var updatedDefinition = ModelProperty.create(propConfig);
        updatedDefinition.$promise
          .then(function deleteOldModelProperty() {
            return ModelProperty.deleteById({ id: oldId }).$promise;
          })
          .then(function() {
            deferred.resolve(updatedDefinition);
          })
          .catch(function(err) {
            console.warn('Cannot rename %s to %s.', oldId, propConfig.id, err);
          });
      }

      return deferred.promise;
    };

    svc.deleteModelProperty = function(config) {
      var deferred = $q.defer();
      ModelProperty.deleteById({id: config.id},
        //success
        function(response) {
          return deferred.resolve(response);
        },
        // fail
        function(response) {
          console.warn('bad delete model properties: ' + response);
          return deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    return svc;
  }
]);
