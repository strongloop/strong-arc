// Copyright StrongLoop 2014
Datasource.service('DatasourceService', [
  'Datasourcedef',
  'DataSourceDefinition',
  '$q',
  function(Datasourcedef, DataSourceDefinition, $q) {
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
    svc.getDiscoveryModalConfig = function(name) {
      return {
        templateUrl: './scripts/modules/app/templates/discovery.modal.html',
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
