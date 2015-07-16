VisualComposer.controller('VisualComposerMainController', [
  '$scope',
  'ModelService',
  function VisualComposerMainController($scope, ModelService) {
    $scope.models = [];

    ModelService.getAllModelInstances()
      .then(function(result) {
        $scope.models = result;
      });

    return;
  }
]);
