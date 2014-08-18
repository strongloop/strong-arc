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
      var deferred = $q.defer();

      // this should be ModelProperty.create
      ModelProperty.create({}, propConfig,
        function(response) {
          deferred.resolve(response);
        },
        function(response) {

          console.warv('bad create model property: ' + response);
        }

      );

      return deferred.promise;
    };
    svc.updateModelProperty = function(propConfig) {
      var deferred = $q.defer();
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

      return deferred.promise
    };

    return svc;
  }
]);
