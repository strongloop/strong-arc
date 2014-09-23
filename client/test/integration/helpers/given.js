var given = {};

given.emptyWorkspace = function() {
  return inject(function($http, $rootScope, $q, throwHttpError) {
    function reset() {
      return $http({
        method: 'POST',
        url: '/reset'
      }).catch(throwHttpError);
    }

    // NOTE(bajtos) When a new app instance is created before each test,
    // the app loads the project name from package.json.
    // We have to wait for that request to finish to prevent console warnings

    if ($rootScope.projectName) {
      // `app.run()` has already finished
      return reset();
    }

    // wait for `app.run()` to finish
    var deferred = $q.defer();
    var resolved = false;
    $rootScope.$watch('projectName', function() {
      if (resolved) return;
      resolved = true;
      reset().then(
        function(res) {
          deferred.resolve(res);
        },
        function(err) {
          deferred.reject(err);
        });
    });

    return deferred.promise;
  });
};

var _givenValueCounter = 0;

given.modelInstance = function(definitionData, configData) {
  return inject(function(CONST, ModelDefinition, ModelConfig) {
    definitionData = angular.extend({
      name: 'aModelDefinition_' + (++_givenValueCounter),
      facetName: 'common',
    }, definitionData);
    configData = angular.extend({
      name: definitionData.name,
      facetName: 'server'
    });

    // TODO(bajtos) Use ModelService.createNewModelInstance() instead
    return {
      id: definitionData.id,
      type: CONST.MODEL_TYPE,
      name: definitionData.name,
      definition: new ModelDefinition(definitionData),
      properties: [],
      config: new ModelConfig(configData)
    };
  });
};

given.dataSourceInstance = function(definitionData) {
  return inject(function(DataSourceService) {
    definitionData = angular.extend({
      name: 'aDataSourceDefinition' + (++_givenValueCounter),
      facetName: 'server',
      connector: 'memory',
    }, definitionData);
    return DataSourceService.createNewDataSourceInstance(definitionData);
  });
};
