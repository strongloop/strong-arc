Explorer.service('ExplorerService', [
  'CONST',
  'FacetSetting',
  '$http',
  'throwHttpError',
  '$q',
  function(CONST, FacetSetting, $http, throwHttpError, $q) {
    var svc = {};

    svc.getSwaggerResources = function() {
      var swaggerUrl;
      var portFilter = { where: { facetName: CONST.APP_FACET, name: 'port' }};
      return FacetSetting.find({ filter: portFilter }).$promise
        .then(function(list) {
          var port = list.length ? list[0].value : 3000;
          swaggerUrl = 'http://localhost:' + port + '/explorer/resources';
        })
        .then(function fetchSwaggerRoot() {
          return $http.get(swaggerUrl);
        })
        .catch(function(err) {
          // Detect when the target app is not running.
          // Angular converts HTTP status code 0 to 404 in such case.
          if (err.status === 404 && !err.response) {
            throw new Error(
              'Cannot fetch Explorer metadata, the project is not running.');
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
