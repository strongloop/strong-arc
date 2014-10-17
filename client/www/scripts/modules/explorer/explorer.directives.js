// Copyright StrongLoop 2014
Explorer.directive('slExplorerView', [
  'ExplorerService',
  function(ExplorerService) {
    return {
      replace:true,
      controller: function($scope) {
        $scope.explorerResources = [];

        $scope.isExplorerViewOpen = function() {

          var currentExplorerWidth = $('[data-id="ExplorerContainer"]').width();
          if (currentExplorerWidth > 20) {
            return true;
          }
          return false;
        };
        $scope.openExplorerView = function() {

          var currentExplorerWidth = $('[data-id="ExplorerContainer"]').width();
          if (currentExplorerWidth > 20) {
            return true;
          }
          return false;
        };
        $scope.closeExplorerView = function() {

          var currentExplorerWidth = $('[data-id="ExplorerContainer"]').width();
          if (currentExplorerWidth > 21) {
            return true;
          }
          return false;
        };
        /*
         *
         * API Explorer View
         *
         * */
        $scope.refreshExplorerResources = function() {
          ExplorerService.getSwaggerResources()
            .then(function(result) {
              $scope.explorerResources = result;
            });
        };
        $scope.refreshExplorerResources();

        $scope.toggleExplorerView = function() {
          var currentExplorerWidth = $('[data-id="ExplorerContainer"]').width();
          if (currentExplorerWidth > 25) {
            $('[data-id="ExplorerViewTitleContainer"]').hide(400);
            $('[data-id="ExplorerContainer"]').animate({width:'24px'}, 400);
          }
          else {
            $('[data-id="ExplorerViewTitleContainer"]').show();
            $('[data-id="ExplorerContainer"]').animate({width:'100%'}, 400);
          }

        }
      },
      link: function(scope, el, attrs) {

        function renderComp() {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
          // Element Height = Viewport height - element.offset.top - desired bottom margin
          var headerHeight = $('[data-id="AppHeaderContainer"]').outerHeight();
          var windowHeight = $(window).outerHeight();
          $('.explorer-view-body').height(windowHeight - headerHeight);
        }
        scope.$watch('explorerResources', function(models) {
          renderComp();
        }, true);
        scope.$watch('activeModelInstance', function(instance) {
          renderComp();
        }, true);
        scope.$watch('mainNavModels', function(instance) {
          renderComp();
        }, true);
        scope.$watch('latestExplorerEndPointResponses', function(response) {
          renderComp();
        }, true);
        scope.$watch('explorerDataModelChanged', function(response) {
          renderComp();
        }, true);
        scope.$watch('toggleIsAppRestarted', function(response) {
          scope.explorerResources = ExplorerService.getSwaggerResources()
            .then(function(result) {
              scope.explorerResources = result;
            });
        }, true);

      }
    }
  }
]);
