// Copyright StrongLoop 2014
Datasource.service('DatasourceService', [
  'Datasourcedef',
  '$q',
  function(Datasourcedef, $q) {
    var svc = {};
    //  var deferred = $q.defer();
    svc.getAllDatasources = function() {
      return Datasourcedef.alldefinitions({},
        function(response) {

         // console.log('good get datasource defs: '+ response);

          var core = response.name[0];
          var log = [];
          var datasources = [];
          angular.forEach(core, function(value, key){
            this.push(key + ': ' + value);
            datasources.push({name:key,props:value});
          }, log);

          // $scope.models = models;
          window.localStorage.setItem('ApiDatasources', JSON.stringify(core));
          return datasources;
        },
        function(response) {
          console.log('bad get datasource defs');

        }

      );
    };
    svc.getDatasourceByName = function(name) {

      if (window.localStorage.getItem('ApiDatasources')) {
        var currDSCollection = JSON.parse(window.localStorage.getItem('ApiDatasources'));
        var targetDS = currDSCollection[name];
        targetDS.name = name;
        return targetDS;
      }
    };
    svc.createDatasourceDef = function(datasourceDefObj) {
      return Datasourcedef.create(datasourceDefObj);
    };
    svc.getDatasourceTables = function(dsName) {
      return Datasourcedef.discoverschema({},
        function(response) {

      //    console.log('good get tables defs: '+ response);

//          var core = response[0];
//          var log = [];
//          var datasources = [];
//          angular.forEach(core, function(value, key){
//            this.push(key + ': ' + value);
//            datasources.push({name:key,props:value});
//          }, log);

          // $scope.models = models;
          return response.schema;
        },
        function(response) {
          console.log('bad get datasource defs');

        }

      );
    }
    return svc;
  }
]);
