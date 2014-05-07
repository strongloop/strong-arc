// Copyright StrongLoop 2014
Datasource.directive('datasourceEditorForm', [
  'DatasourceService',
  function(DatasourceService) {
    return {
      templateUrl: './scripts/modules/datasource/templates/datasource.form.html',
      link: function(scope, elem, attrs) {
        console.log('data source form');


        scope.cDatasource = {
          defaultForType: 'mysql',
          connector: 'loopback-connector-mysql',
          database: 'apm',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          debug: true
        };
        scope.saveDatasource = function() {
          console.log('try to save the data');
          if (scope.cDatasource && scope.cDatasource.id) {
            console.log('update datasource ');
          } else {
            console.log('create datasource');
            DatasourceService.createDatasourceDef(scope.cDatasource,
              function(response) {
                console.log('good datasource');

              },
              function(response) {
                console.log('bad datasource');
              }
            );
          }
        }
      }
    }
  }
]);
