VisualComposer.controller('VisualComposerMainController', [
  '$scope',
  '$q',
  'ModelService',
  function VisualComposerMainController($scope, $q, ModelService) {
    var models = $q.defer();

    $scope.models = [];
    $scope.connections = [
      {
        source: 'common.FooModel.Carrot',
        target: 'common.TriggerRequest'
      },
      {
        source: 'common.TriggerRequest.timeout',
        target: 'common.RedBox'
      },
      {
        source: 'common.TriggerRequest.count',
        target: 'common.FooModel'
      }
    ];

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

    models.promise.then(function(models) {
      $scope.models = models;
    });
  }
]);
