// Copyright StrongLoop 2014


/*
 *
 *   Datasource Instance Editor
 *
 * */
Datasource.directive('slDatasourceEditorForm', [
  'DataSourceService',
  'connectorMetadata',
  function(DataSourceService, connectorMetadata) {
    return {
      replace:true,
      link: function(scope, el, attrs) {
        scope.$watch('activeInstance', function(instance) {
          if(instance.type === CONST.DATASOURCE_TYPE) {
            React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
          }
        }, true);
        scope.$watch('activeInstanceUpdated', function() {
          if(scope.activeInstance.type === CONST.DATASOURCE_TYPE) {
            React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
          }
        }, true);
        scope.$watch('datasource.connectionTestResponse', function(response) {
          React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
        }, true);

        scope.connectorMetadata = connectorMetadata;
      }
    }
  }
]);
