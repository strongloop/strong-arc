// Copyright StrongLoop 2014
IA.directive('slIaMainNav', [
  'ModelService',
  'DataSourceService',
  'IAService',
  '$timeout',
  function(ModelService, DataSourceService, IAService, $timeout) {
    return {
      replace: true,
      link: function(scope, el, attrs) {

        function processActiveNavState() {
          // models
          var openModelNames = IAService.getOpenModelNames();
          var openDatasourceNames = scope.currentOpenDatasourceNames;
          var currActiveModelInstanceName = '';

          if (scope.activeInstance && scope.activeInstance.name) {


            if (scope.activeInstance.type === CONST.MODEL_TYPE) {
              currActiveModelInstanceName = scope.activeInstance.name;
            }

          }
          for (var x = 0;x < scope.mainNavModels.length;x++){
            var localInstance = scope.mainNavModels[x];
            localInstance.isActive = false;
            localInstance.isOpen = false;
            localInstance.isSelected = false;

            for (var i = 0;i < openModelNames.length;i++) {
              if (openModelNames[i] === localInstance.name) {
                localInstance.isOpen = true;
                break;
              }
            }
            if (currActiveModelInstanceName === localInstance.name) {
              localInstance.isActive = true;
            }
            for (var k = 0;k < scope.currentSelectedCollection.length;k++) {
              if (scope.currentSelectedCollection[k] === localInstance.name) {
                localInstance.isSelected = true;
                break;
              }
            }
          }
          // datasources
          var openDatasourceNames = scope.currentOpenDatasourceNames;
          var currActiveDatasourceInstanceName = '';
          if (scope.activeInstance && (scope.activeInstance.type === CONST.DATASOURCE_TYPE)) {
            currActiveDatasourceInstanceName = scope.activeInstance.name;
          }

          if (scope.mainNavDatasources.length){

            var discoverableDatasources = DataSourceService.getDiscoverableDatasourceConnectors();

            for (var h = 0;h < scope.mainNavDatasources.length;h++){
              var localDSInstance = scope.mainNavDatasources[h];
              localDSInstance.isActive = false;
              localDSInstance.isOpen = false;
              localDSInstance.isSelected = false;
              localDSInstance.isDiscoverable = false;

              // is it discoverable
             // if (localDSInstance.children && localDSInstance.children.connector) {
              if (localDSInstance && localDSInstance.definition.connector) {
                for (var w = 0;w < discoverableDatasources.length;w++) {
                  if (localDSInstance.definition.connector === discoverableDatasources[w]) {
                    localDSInstance.isDiscoverable = true;
                    break;
                  }
                }
              }

              // is it open
              for (var r = 0;r < openDatasourceNames.length;r++) {
                if (openDatasourceNames[r] === localDSInstance.name) {
                  localDSInstance.isOpen = true;
                  break;
                }
              }
              // is it active
              if (currActiveDatasourceInstanceName === localDSInstance.name) {
                localDSInstance.isActive = true;
              }
              // is it selected
              for (var w = 0;w < scope.currentSelectedCollection.length;w++) {
                if (scope.currentSelectedCollection[w] === localDSInstance.name) {
                  localDSInstance.isSelected = true;
                  break;
                }
              }
            }
          }
        }

        var renderComp = function() {
          $timeout(function() {

          //  if (!scope.mainNavDatasources.$promise) {
              React.renderComponent(IAMainNavContainer({scope:scope}), el[0]);
          //  }

          }, 140);


        };
        scope.$watch('currentSelectedCollection', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('apiModelsChanged', function() {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('openInstanceRefs', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('activeInstance', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('modelNavIsVisible', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('dsNavIsVisible', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('currentOpenDatasourceNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('currentOpenModelNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('mainNavModels', function(mainNavModels) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('mainNavDatasources', function(mainNavDatasources) {
          processActiveNavState();
          renderComp();
        }, true);

      }
    }
  }
]);
/*
*
*   Main Search
*
* */
IA.directive('slIaMainSearch', [
  function() {
    return  {
      templateUrl: './scripts/modules/ia/templates/ia.main.search.html'
    }
  }
]);
/*
*
*   Main Controls
*
* */
IA.directive('slIaMainControls', [
  '$timeout',
  'growl',
  function($timeout, growl) {
    return  {
      replace: true,
      link: function(scope, el, attrs) {

        var renderComp = function() {
          React.renderComponent(IAMainControls({scope:scope}), el[0]);
        };
        scope.$watch('activeInstance', function(instance) {
          renderComp();
        });


      }
    }
  }
]);

/*
 *
 *   IA Main Content
 *
 * */
IA.directive('slIaMainContent', [
  function() {
    return {
      templateUrl: './scripts/modules/ia/templates/ia.main.content.html',
      link: function(scope, el, attrs) {

        setUI();
      }
    }
  }
]);
/*
*
* slIAInstanceContainer
*
*
* */
IA.directive('slIAInstanceContainer', [
  function() {
    return {
      templateUrl: './scripts/modules/ia/templates/ia.instance.container.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
/*
*
*   slIAClearDbNavItem
*
* */
IA.directive('slIaCleardbNavItem', [
  'AppStorageService',
  'growl',
  function(AppStorageService, growl) {
    return {
      template: '<li><a href="#composer" ng-click="clearDB()">reset</a></li>',
      controller: function($scope, $location) {

        $scope.clearDB = function() {
          if (confirm('clear local cache?')) {
            AppStorageService.clearStorage();
            $location.path('/#composer');
            growl.addSuccessMessage("cleared composer caches");
          }
        }
      },
      replace: true
    }
  }
]);
