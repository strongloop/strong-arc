Explorer.service('ExplorerService', [
  'CONST',
  'FacetSetting',
  'Workspace',
  '$http',
  '$q',
  function(CONST, FacetSetting, Workspace, $http, $q) {
    var svc = this;

    svc.getSwaggerResources = function() {
      var host, port, swaggerUrl;
      var portFilter = { where: { facetName: CONST.APP_FACET, name: 'port' }};
      var hostFilter = { where: { facetName: CONST.APP_FACET, name: 'host' }};
      return FacetSetting.find({ filter: hostFilter }).$promise
        .then(function saveHostConfig(list) {
          // NOTE(bajtos) Windows does not support '0.0.0.0' in URLs
          // We need to replace that value with `localhost`
          host = list.length && list[0].value !== '0.0.0.0' ?
            list[0].value : 'localhost';
        })
        .then(function findPortConfig() {
          return FacetSetting.find({ filter: portFilter }).$promise;
        })
        .then(function savePortConfig(list) {
          port = list.length ? list[0].value : 3000;
        })
        .then(function ensureAppIsRunning() {
          return Workspace.start().$promise;
        })
        .then(function fetchSwaggerRoot() {
          swaggerUrl = 'http://' + host + ':' + port + '/explorer/resources';
          return $http.get(swaggerUrl);
        })
        .catch(function(err) {
          // Detect when the target app is not running.
          // Angular converts HTTP status code 0 to 404 in such case.
          if (err.status === 404 && !err.response) {
            throw new Error(
              'Cannot fetch Explorer metadata, the project is not running.');
          } else {
            throw err;
          }
        })
        .then(function fetchAllApis(response) {
          return $q.all(
            response.data.apis.map(function fetchSingleApi(api) {
              return $http.get(swaggerUrl + api.path)
                .then(function(response) {
                  return response.data;
                });
            })
          );
        });
    };

    return svc;
  }
]);
