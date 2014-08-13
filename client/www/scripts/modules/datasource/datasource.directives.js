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
  'DataSourceService',
  function(DataSourceService) {
    return {
      replace:true,
      link: function(scope, el, attrs) {
        console.log('data source form');

        scope.$watch('activeInstance', function(instance) {
          if(instance.type === 'datasource') {
            if (!instance.props) {
              scope.activeInstance.props = {};
            }
            React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);

          }
        }, true);
      }
    }
  }
]);
