describe('ModelService', function() {
  var CONST, ModelDefinition, ModelService, IAService, throwHttpError;

  beforeEach(function() {
    inject(function(_CONST_,
                    _ModelDefinition_,
                    _ModelService_,
                    _IAService_,
                    _throwHttpError_) {
      CONST = _CONST_;
      ModelDefinition = _ModelDefinition_;
      ModelService = _ModelService_;
      IAService = _IAService_;
      throwHttpError = _throwHttpError_;
    });
  });

  beforeEach(given.emptyWorkspace);

  describe('.createModelInstance()', function() {
    it('removes internal Studio properties', function() {
      var instance = given.modelInstance();

      // setActiveInstance used to add `type` property
      IAService.setActiveInstance(instance, CONST.MODEL_TYPE);

      return ModelService.createModelInstance(instance)
        .then(function(created) {
          return ModelDefinition.findById({ id: created.id }).$promise;
        })
        .then(function(found) {
          var properties = Object.keys(found);
          expect(properties).to.not.include('config');
          expect(properties).to.not.include('type');
        });
    });
  });

  describe('.updateModelInstance()', function() {
    it('removes internal Studio properties on update', function() {
      var instance = given.modelInstance();

      return ModelService.createModelInstance(instance)
        .then(function(created) {
          // setActiveInstance used to add `type` property
          IAService.setActiveInstance(created, CONST.MODEL_TYPE);

          return ModelService.updateModelInstance(created);
        })
        .then(function(updated) {
          return ModelDefinition.findById({ id: updated.id }).$promise;
        })
        .then(function(found) {
          var properties = Object.keys(found);
          expect(properties).to.not.include('config');
          expect(properties).to.not.include('type');
        });
    });
  });
});
