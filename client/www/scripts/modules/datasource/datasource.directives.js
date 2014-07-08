// Copyright StrongLoop 2014


/*
 *
 *   Datasource Instance Editor
 *
 * */

/*
*
* marked for deletion = convert directly to form directive below
*
*
* */
Datasource.directive('slDatasourceInstanceEditor', [
  function() {
    return {
      replace:true,
      templateUrl: './scripts/modules/datasource/templates/datasource.instance.editor.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Datasource.directive('datasourceEditorForm', [
  'DatasourceService',
  function(DatasourceService) {
    return {
      replace:true,
      link: function(scope, el, attrs) {
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
        };
        scope.$watch('activeDatasourceInstance', function(instance) {
          React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
        })
      }
    }
  }
]);
