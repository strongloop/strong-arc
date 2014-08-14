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
          console.log('data source form ACTIVE INTANCE CHANGE WATCH');
          if(instance.type === 'datasource') {
            console.log('data source form ACTIVE INTANCE CHANGE REMDER');
            React.renderComponent(DatasourceEditorView({scope:scope}), el[0]);
          }
        }, true);
      }
    }
  }
]);
