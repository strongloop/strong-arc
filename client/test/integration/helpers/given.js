var given = {};

given.emptyWorkspace = function() {
  // Increase the timeout when run via `beforeEach(given.emptyWorkspace)`
  // in order to support slow CI build slaves
  if (typeof this.timeout === 'function') {
    this.timeout(30000);
  }

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

given.targetAppIsRunning = function() {
  return inject(function(Workspace, throwHttpError) {
    return Workspace.start().$promise.catch(throwHttpError);
  });
};

given.targetAppIsStopped = function() {
  return inject(function(Workspace, throwHttpError) {
    return Workspace.stop().$promise.catch(throwHttpError);
  });
};

given.uniqueServerPort = function() {
  return inject(function($http, throwHttpError) {
    return $http.post('/given/unique-server-port')
      .then(function(response) {
        return response.data.port;
      })
      .catch(throwHttpError);
  });
};

var _givenValueCounter = 0;

given.modelInstance = function(definitionData, configData) {
  return inject(function(CONST, ModelDefinition, ModelConfig) {
    definitionData = angular.extend({
      name: 'aModelDefinition_' + (++_givenValueCounter),
      facetName: 'common'
    }, definitionData);
    configData = angular.extend({
      name: definitionData.name,
      facetName: 'server'
    }, configData);

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
      connector: 'memory'
    }, definitionData);
    return DataSourceService.createNewDataSourceInstance(definitionData);
  });
};

given.facetConfig = function(facetName, settings) {
  return inject(function($q, FacetSetting) {
    return $q.all(Object.keys(settings).map(function(key) {
      var filter = { where: { facetName: facetName, name: key }};
      return FacetSetting.find({ filter: filter }).$promise
        .then(function(list) {
          if (list.length) {
            list[0].value = settings[key];
            return list[0].$save();
          } else {
            return FacetSetting.create({
              facetName: facetName,
              name: key,
              value: settings[key]
            }).$promise;
          }
        });
    }));
  });
};

given.mysqlDataSource = function(dataSourceName) {
  return inject(function(CONST, DataSourceDefinition) {
    return DataSourceDefinition.create({
      facetName: CONST.APP_FACET,
      name: dataSourceName,
      connector: 'mysql',
      // the database and credentials are created by /build-tasks/setup-mysql.js
      database: 'strong_studio_test',
      username: 'studio',
      password: 'zh59jeol'
    }).$promise;
  });
};

given.facetIsMissing = function(facetName) {
  return inject(function($http) {
    return $http.post('/delete-facet/' + facetName)
      .then(function() {
        return inject(function(Facet) {
          return Facet.find().$promise;
        });
      });
  });
};
