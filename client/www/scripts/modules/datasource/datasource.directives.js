// Copyright StrongLoop 2014
/*
 *
 * Datasource Editor Main
 *
 * */
Datasource.directive('slDatasourceEditorMain',[
  function() {
    return {
      replace: true,
      templateUrl: './scripts/modules/datasource/templates/datasource.editor.main.html',
      link: function(scope, element, attrs) {

        console.log('sl-datasource-editor-main');


      }
    }
  }
]);
/*
 *
 *
 *   DATASOURCE INSTANCE HEADER
 *
 * */
Datasource.directive('slDatasourceInstanceHeader', [
  function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, el, attrs) {
        scope.$watch('activeDatasourceInstance', function(newVal, oldVal) {
          React.renderComponent(DatasourceTitleHeader({scope: scope}), el[0]);
        });
      }
    }
  }
]);
/*
 *
 * Datasource Editor Tabs View
 *
 * */
Datasource.directive('slDatasourceEditorTabsView', [
  'IAService',
  function(IAService) {
    return {
      link: function(scope, el, attrs) {

        function renderComp(){
          var tabItems = [];

          for (var i = 0;i < scope.currentOpenDatasourceNames.length;i++) {
            var isActive = false;
            if (scope.currentOpenDatasourceNames[i] === IAService.getActiveDatasourceInstance().name) {
              isActive = true;
            }
            tabItems.push({
              name:scope.currentOpenDatasourceNames[i],
              isActive:isActive
            });
          }

          React.renderComponent(DatasourceEditorTabsView({scope:scope, tabItems:tabItems}), el[0]);
        }

        scope.$watch('activeDatasourceInstance', function(newVal, oldVal) {
          renderComp();
        });
//        scope = scope.$parent;
        scope.$watch('currentOpenDatasourceNames', function(newNames, oldNames) {
          renderComp();
        });
      }
    }
  }
]);
/*
 *
 *   Datasource Instance Editor
 *
 * */
Datasource.directive('slDatasourceInstanceEditor', [
  function() {
    return {
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
    //  templateUrl: './scripts/modules/datasource/templates/datasource.form.html',
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
