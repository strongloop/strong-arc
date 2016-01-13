// Copyright StrongLoop 2014


/*
 *
 *   Datasource Instance Editor
 *
 * */
Datasource.directive('slDatasourceEditorForm', [
  'DataSourceService',
  'connectorMetadata',
  '$timeout',
  function(DataSourceService, connectorMetadata, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        activeInstance: '=',
        onClearMessages: '&',
        onTestConnection: '&',
        onUpdateDatasource: '&'
      },
      templateUrl: './scripts/modules/datasource/templates/datasource.editor.view.html',
      link: function(scope, el, attrs) {
        scope.isNameValid = false;
        scope.isConnectorValid = false;
        scope.isFormValid = false;
        scope.isTesting = false;
        scope.testConnectionStatus = 'success';
        scope.testConnectionMessage = '';

        scope.isNameValid = function() {
          if (scope.dsModel) {
            return /^[\-_a-zA-Z0-9]+$/.test(scope.dsModel.name);
          }

          return false;
        };

        scope.isConnectorValid = function(connector) {
          if (scope.dsModel) {
            return connectorMetadata.some(function(x) {
              return x.name === scope.dsModel.connector;
            });
          }

          return false;
        };

        scope.isFormValid = function() {
          return scope.isNameValid() && scope.isConnectorValid();
        };

        scope.isTesting = function() {
          if (scope.activeInstance) {
            return !scope.activeInstance.connectionTestResponse;
          }

          return false;
        };

        scope.testConnection = function(event) {
          if (event && event.preventDefault) {
            event.preventDefault();
          }

          scope.isTesting = true;
          scope.onTestConnection({ data: scope.activeInstance })
            .then(function(response) {
              scope.isTesting = false;

              if (response.status) {
                scope.testConnectionStatus = 'success';
                scope.testConnectionMessage = 'Success.';
              } else {
                scope.testConnectionStatus = 'error';
                scope.testConnectionMessage = response.error.message;
              }
            });
        };

        scope.$watch('activeInstance', function(newVal) {
          scope.dsModel = newVal.definition;
        });

        scope.saveDatasource = function() {
          if (scope.isFormValid()) {
            scope.onUpdateDatasource({
              data: scope.activeInstance
            });
          }
        };

        scope.connectorOptions = connectorMetadata;

        $timeout(function() {
          window.setScrollView('[data-id="DatasourceEditorInstanceContainer"]');
        }, 200);

        window.onresize = function() {
          window.setScrollView('[data-id="DatasourceEditorInstanceContainer"]');
        };
      }
    }
  }
]);
