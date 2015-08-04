VisualComposer.controller('VisualComposerMainController', [
  '$scope',
  '$q',
  'ModelService',
  function VisualComposerMainController($scope, $q, ModelService) {
    var models = $q.defer();

    $scope.models = [];
    $scope.connections = [];

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
