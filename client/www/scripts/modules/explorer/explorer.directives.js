// Copyright StrongLoop 2014
Explorer.directive('slExplorerView', [
  'ExplorerService',
  function(ExplorerService) {
    return {
      replace:true,
      controller: function($scope) {

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
        $scope.explorerResources = ExplorerService.getSwaggerResources()
          .then(function(result) {
            $scope.explorerResources = result;
          });
        $scope.toggleExplorerView = function() {
          var currentExplorerWidth = $('[data-id="ExplorerContainer"]').width();
          if (currentExplorerWidth > 25) {
            $('[data-id="ExplorerContainer"]').animate({width:'24px'}, 400);
          }
          else {
            $('[data-id="ExplorerContainer"]').animate({width:'97%'}, 400);
          }

        }
      },
      link: function(scope, el, attrs) {

//        jQuery('[data-id="InstanceSliderBtn"]').click(function() {
//          scope.toggleInstanceContainer();
//        });
        function renderComp() {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }

//        jQuery('[data-id="ExplorerContainer"]').drags();
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




      }
    }
  }
]);
