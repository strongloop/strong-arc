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

  describe('.createModel()', function() {
    it('removes internal Studio properties', function() {
      var def = ModelService.createNewModelInstance(given.modelDefinition());

      // setActiveInstance adds `type` property
      IAService.setActiveInstance(def, CONST.MODEL_TYPE);

      return ModelService.createModel(def)
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

  describe('.updateModel()', function() {
    it('removes internal Studio properties on update', function() {
      var def = ModelService.createNewModelInstance(given.modelDefinition());
      return ModelService.createModel(def)
        .then(function(response) {
          // setActiveInstance adds `type` property
          IAService.setActiveInstance(response, CONST.MODEL_TYPE);

          return ModelService.updateModel(response);
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
