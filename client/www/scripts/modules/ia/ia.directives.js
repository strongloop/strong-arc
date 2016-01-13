// Copyright StrongLoop 2014
IA.directive('slIaMainNav', [
  'ModelService',
  'DataSourceService',
  'IAService',
  '$timeout',
  function(ModelService, DataSourceService, IAService, $timeout) {
    return {
      replace: true,
      templateUrl: './scripts/modules/ia/templates/ia.nav.container.html',
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
      scope: {},
      templateUrl: './scripts/modules/ia/templates/ia.nav.main.controls.html',
      controller: function($scope) {
        $scope.createModelViewRequest = function(event){
          $scope.$parent.createModelViewRequest(event);
        }
      }
    }
  }
]);

IA.directive('slIaNavModel', [function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ia/templates/ia.nav.model.html',
    controller: function($scope){
      $scope.addNewModelInstanceRequest = function(event) {
        $scope.createModelViewRequest();
      };
    }
  };
}]);

IA.directive('slIaNavDatasource', [function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ia/templates/ia.nav.datasource.html',
    controller: function($scope){
      $scope.addNewDatasourceInstanceRequest = function(event) {
        if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
          var val = '';
          if (event.target.attributes['data-type']) {
            val = event.target.attributes['data-type'].value;
          }
          else {
            val = event.target.parentElement.attributes['data-type'].value;
          }
            $scope.createDatasourceViewRequest();
        }
      };
    }
  };
}]);

IA.directive('slIaNavModelContext', [function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<span></span>',
    scope: {
      triggerSelector: '@'
    },
    link: function(scope, elem, attrs) {
      var deleteSelectedModel = function(key, opt) {
        try {
          var targetAttributes = opt.sourceEvent.currentTarget.attributes;
          if (targetAttributes['data-id']) {
            var definitionId = targetAttributes['data-id'].value;
            var configId = targetAttributes['data-config-id'] && targetAttributes['data-config-id'].value;
            var instanceId = {
              definitionId: definitionId,
              configId: configId
            };

            scope.$parent.deleteInstanceRequest(instanceId, CONST.MODEL_TYPE);
          } else {
            console.warn('Missing some of the required model attributes.');
          }
        } catch (error) {
          console.warn('error deleting model definition: ' + error);
        }
      };

      var menuItems = {};
      menuItems.deleteSelectedModel = {
        name: 'delete',
        className: 'context-menu-model-delete',
        callback: deleteSelectedModel
      };

      $.contextMenu({
        // define which elements trigger this menu
        selector: scope.triggerSelector,
        trigger: 'left',
        // define the elements of the menu
        items: menuItems
      });
    }
  };
}]);

IA.directive('slIaNavModelRow', [function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ia/templates/ia.nav.model.row.html',
    scope: {
      item: '=',
      onItemClick: '&'
    },
    controller: function($scope){
      $scope.showDsConnectEl = false;

      // TODO - SEAN fix this bug - it needs to reference 'config' for dataSource
      if ($scope.item.dataSource && ($scope.item.dataSource !== CONST.DEFAULT_DATASOURCE)) {
        $scope.showDsConnectEl = true;
      }

      $scope.item.configId = $scope.item.config && $scope.item.config.id;

      $scope.singleClickItem = function(obj, event) {
        $scope.onItemClick({
          type: 'model',
          id: obj.id,
          meta: event.metaKey
        });
      };
    }
  };
}]);

IA.directive('slIaNavDatasourceContext', [function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<span></span>',
    scope: {
      triggerSelector: '@',
      discoverModels: '&'
    },
    link: function(scope, elem, attrs) {
      //handles deletion of both models and datasources based on type passed to deleteInstanceRequest()
      var deleteSelectedDataSource = function(key, opt) {
        try {
          var targetAttributes = opt.sourceEvent.currentTarget.attributes;
          if (targetAttributes['data-id']) {
            var definitionId = targetAttributes['data-id'].value;
            var configId = targetAttributes['data-config-id'] && targetAttributes['data-config-id'].value;
            var instanceId = {
              definitionId: definitionId,
              configId: configId
            };

            scope.$parent.deleteInstanceRequest(instanceId, CONST.DATASOURCE_TYPE); //delete datasource instead of model
          } else {
            console.warn('Missing some of the required model attributes.');
          }
        } catch (error) {
          console.warn('error deleting model definition: ' + error);
        }
      };

      var menuItems = {};

      menuItems.createModelsFromDS = {
        name: 'discover models',
        className: 'context-menu-ds-discover',
        disabled: function(key, opt) {
          if (opt.sourceEvent.target.attributes['data-is-discoverable']) {
            isDiscoverable = opt.sourceEvent.target.attributes['data-is-discoverable'].value;
          } else if (opt.sourceEvent.target.parentElement.attributes['data-name']) {
            isDiscoverable = opt.sourceEvent.target.parentElement.attributes['data-is-discoverable'].value;
          }

          if (isDiscoverable === 'true') {
            return false;
          }

          return true;
        },
        callback: function(key, opt) {
          var dsId = '';

          if (opt.sourceEvent.target.attributes['data-id']) {
            dsId = opt.sourceEvent.target.attributes['data-id'].value;
          } else if (opt.sourceEvent.target.parentElement.attributes['data-id']) {
            dsId = opt.sourceEvent.target.parentElement.attributes['data-id'].value;
          }

          if (dsId) {
            scope.discoverModels({
              datasource: dsId
            });
          }
        }
      };

      menuItems.deleteSelectedDataSource = {
        name: 'delete',
        className: 'context-menu-ds-delete',
        callback: deleteSelectedDataSource
      };

      $.contextMenu({
        // define which elements trigger this menu
        selector: scope.triggerSelector,
        trigger: 'left',
        items: menuItems,
        events: {
          show: function(opt, event) {
            if (opt.sourceEvent.target.attributes['data-name']) {
              currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
            }

            if (opt.sourceEvent.target.attributes['data-is-discoverable']) {
              var isDiscoverable = JSON.parse(
                opt.sourceEvent.target.attributes['data-is-discoverable'].value
              );

              // note the order of menu items to target not showing discover item on
              // ds types that don't support it.
              // show by default (in case it was turned off by another item as it is shared
              $('.context-menu-list li:first-child').show();
              if (!isDiscoverable) {
                $('.context-menu-list li:first-child').hide();
              }
            }
          }
        }
      });
    }
  };
}]);

IA.directive('slIaNavDatasourceRow', [function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ia/templates/ia.nav.datasource.row.html',
    scope: {
      item: '=',
      onItemClick: '&'
    },
    controller: function($scope) {
      var isDiscoverable = false;
      if ($scope.item.isDiscoverable) {
        isDiscoverable = $scope.item.isDiscoverable;
      }

      if ($scope.item.dataSource && ($scope.item.dataSource !== CONST.DEFAULT_DATASOURCE )) {
        $scope.showDsConnectEl = true;
      }

      $scope.singleClickItem = function(obj, event) {
        $scope.onItemClick({
          type: 'datasource',
          id: obj.id,
          meta: event.metaKey
        });
      };
    }
  };
}]);

IA.directive('slIaNavMainDatasource', [
  function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: './scripts/modules/ia/templates/ia.nav.main.datasource.html',
      controller: function($scope){
        $scope.isDataSourceNavContainerOpen = true;

        $scope.openSelectedDataSource = function(key, opt) {
          if (opt.sourceEvent.currentTarget.attributes['data-id']) {
            var dsId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
            $scope.$parent.$parent.openSelectedInstance(dsId, CONST.DATASOURCE_TYPE);
          }
        };

        $scope.addNewDatasourceMainInstanceRequest = function(event) {
          if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
            var val = '';
            if (event.target.attributes['data-type']) {
              val = event.target.attributes['data-type'].value;
            }
            else {
              val = event.target.parentElement.attributes['data-type'].value;
            }
            $scope.$parent.$parent.createDatasourceViewRequest();
          }
        };

        $scope.deleteSelectedDataSource = function(key, opt) {
          try{
            if (opt.sourceEvent.currentTarget.attributes['data-id']){
              var dsIdConfig = {
                definitionId: opt.sourceEvent.currentTarget.attributes['data-id'].value
              };
              $scope.$parent.$parent.deleteInstanceRequest(dsIdConfig, CONST.DATASOURCE_TYPE);
            }
          }
          catch(error) {
            console.warn('error deleting model definition: ' + error);
          }
        };
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
