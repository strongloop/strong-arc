// Copyright StrongLoop 2014
Datasource.service('DatasourceService', [
  'Datasourcedef',
  'DataSourceDefinition',
  'AppStorageService',
  '$q',
  function(Datasourcedef, DataSourceDefinition, AppStorageService, $q) {
    var svc = {};
    //  var deferred = $q.defer();
    svc.getDiscoverableDatasourceConnectors = function() {
      return ['loopback-connector-mssql', 'loopback-connector-oracle', 'loopback-connector-mysql', 'loopback-connector-postgresql']
    };
    svc.getAllDatasources = function() {
     // return DataSourceDefinition.query({},
      return Datasourcedef.query({},
        function(response) {
          var datasources = [];
//          if (response && response.length) {
//            datasources = response;
//          }

         // console.log('good get datasource defs: '+ response);

          var core = response[0];
          var log = [];
          var datasources = [];
          angular.forEach(core, function(value, key){
            this.push(key + ': ' + value);
            datasources.push({name:key,props:value});
          }, log);

          // $scope.models = models;
          window.localStorage.setItem('ApiDatasources', JSON.stringify(datasources));
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
        for (var i = 0;i < currDSCollection.length;i++) {
          if (currDSCollection[i].name === name) {
            return currDSCollection[i];
          }
        }
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
          var x = response.schema;
          var y = x;

          return response.schema;

        },
        function(response) {
          console.log('bad get datasource defs');

        }

      );
    };
    svc.createNewDatasourceInstance = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      var defaultDatasourceSchema = {
        name: 'new-datasource',
        type: 'datasource'
      };
      if (!openInstanceRefs) {
        openInstanceRefs = [];
      }
      var doesNewDatasourceExist = false;
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === 'new-datasource') {
          doesNewDatasourceExist = true;
          break;
        }
      }
      if (!doesNewDatasourceExist) {
        openInstanceRefs.push(defaultDatasourceSchema);
        AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      }
      return defaultDatasourceSchema;
    };
    return svc;
  }
]);
