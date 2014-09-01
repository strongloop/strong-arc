// Copyright StrongLoop 2014


/*
 *
 *   Datasource Instance Editor
 *
 * */
Datasource.directive('slDatasourceEditorForm', [
  'DataSourceService',
  function(DataSourceService) {
    return {
      replace:true,
      link: function(scope, el, attrs) {
        scope.$watch('activeInstance', function(instance) {
          if(instance.type === 'datasource') {
            React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
          }
        }, true);
        scope.$watch('datasource.connectionTestResponse', function(response) {
          React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
        }, true);
      }
    }
  }
]);
