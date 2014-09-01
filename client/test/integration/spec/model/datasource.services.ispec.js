describe('DataSourceService', function() {
  var CONST, DataSourceDefinition, DataSourceService, IAService, throwHttpError;

  beforeEach(function() {
    inject(function(_CONST_,
                    _DataSourceDefinition_,
                    _DataSourceService_,
                    _IAService_,
                    _throwHttpError_) {
      CONST = _CONST_;
      DataSourceDefinition = _DataSourceDefinition_;
      DataSourceService = _DataSourceService_;
      IAService = _IAService_;
      throwHttpError = _throwHttpError_;
    });
  });

  beforeEach(given.emptyWorkspace);

  describe('.createDataSource()', function() {
    it('removes internal Studio properties', function() {
      var def = DataSourceService.createNewDataSourceInstance(
        given.dataSourceDefinition());

      // setActiveInstance adds `type` property
      IAService.setActiveInstance(def, CONST.MODEL_TYPE);

      return DataSourceService.createDataSourceDefinition(def)
        .then(function(created) {
          return DataSourceDefinition.findById({ id: created.id }).$promise;
        })
        .then(function(found) {
          var properties = Object.keys(found);
          expect(properties).to.not.include('config');
          expect(properties).to.not.include('type');
        });
    });
  });

  describe('.updateDataSource()', function() {
    it('removes internal Studio properties on update', function() {
      var def = DataSourceService.createNewDataSourceInstance(
          given.dataSourceDefinition());
      return DataSourceService.createDataSourceDefinition(def)
        .then(function(response) {
          // setActiveInstance adds `type` property
          IAService.setActiveInstance(response, CONST.MODEL_TYPE);

          return DataSourceService.updateDataSourceDefinition(response);
        })
        .then(function(updated) {
          return DataSourceDefinition.findById({ id: updated.id }).$promise;
        })
        .then(function(found) {
          var properties = Object.keys(found);
          expect(properties).to.not.include('config');
          expect(properties).to.not.include('type');
        });
    });
  });
});
