VisualComposer.controller('VisualComposerMainController', [
  '$scope',
  '$q',
  'ModelService',
  'IAService',
  function VisualComposerMainController($scope, $q, ModelService, IAService) {
    var models = $q.defer();

    $scope.models = [];
    $scope.connections = [];
    $scope.mainNavModels = [];

    $scope.selectModel = function(model) {
      $scope.activeInstance = IAService.setActiveInstance(model);
    }

    ModelService.getAllModelInstances()
      .then(function(result) {
        var ready = [];

        result.forEach(function(model) {
          ready.push(ModelService.getModelPropertiesById(model.id)
            .then(function(properties) {
              model.properties = properties;
            }));
        });

        $q.all(ready).then(function() {
          models.resolve(result);
        });
      });

    ModelService.getAllModelRelations()
      .then(function(results) {
        // TODO: setup relations
      });

    models.promise.then(function(models) {
      $scope.models = models;
    });
  }
]);
