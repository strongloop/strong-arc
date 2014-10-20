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

  describe('.getAllModelInstances()', function() {
    it('ignores readonly models', function() {
      // A temporary test until this task is implemented:
      // https://github.com/strongloop/strong-studio/issues/431
      return ModelService.getAllModelInstances()
        .then(function(instances) {
          var names = instances.map(function(i) { return i.name; });
          expect(names).to.not.include('RoleMapping');
        });
    });
  });

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

  describe('.isModelConfigMigrateable()', function() {
    var DataSourceService;
    beforeEach(function() {
      inject(function(_DataSourceService_) {
        DataSourceService = _DataSourceService_;
      });
    });

    it('returns false for model not attached to any datasource', function() {
      return ModelService.isModelConfigMigrateable({ dataSource: null })
        .then(function(result) {
          expect(result).to.equal(false);
        });
    });

    it('returns true for model attached to a MySQL datasource', function() {
      var ds = given.dataSourceInstance({ connector: 'mysql' });
      return DataSourceService.createDataSourceInstance(ds)
        .then(function() {
          return ModelService.isModelConfigMigrateable({ dataSource: ds.name });
        })
        .then(function(result) {
          expect(result).to.equal(true);
        });
    });

    it('returns false for model attached to a Memory datasource', function() {
      var ds = given.dataSourceInstance({ connector: 'memory' });
      return DataSourceService.createDataSourceInstance(ds)
        .then(function() {
          return ModelService.isModelConfigMigrateable({ dataSource: ds.name });
        })
        .then(function(result) {
          expect(result).to.equal(false);
        });
    });
  });
});
