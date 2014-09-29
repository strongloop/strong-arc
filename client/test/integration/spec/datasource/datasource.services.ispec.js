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

  describe('.createDataSourceInstance()', function() {
    it('removes internal Studio properties', function() {
      var instance = given.dataSourceInstance();

      // setActiveInstance used to add `type` property
      IAService.setActiveInstance(instance, CONST.MODEL_TYPE);

      return DataSourceService.createDataSourceInstance(instance)
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

  describe('.updateDataSourceInstance()', function() {
    it('removes internal Studio properties on update', function() {
      var instance = given.dataSourceInstance();
      return DataSourceService.createDataSourceInstance(instance)
        .then(function(created) {
          // setActiveInstance used to add `type` property
          IAService.setActiveInstance(created, CONST.MODEL_TYPE);

          return DataSourceService.updateDataSourceInstance(created);
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

  describe('.getDiscoverableDatasourceConnectors()', function() {
    beforeEach(function() {
      return inject(function loadConnectorMetadata(connectorMetadata) {
        return connectorMetadata.$promise;
      });
    });

    it('includes expected connectors', function() {
      var list = DataSourceService.getDiscoverableDatasourceConnectors();
      expect(list).to.include.members([
        'mssql',
        'oracle',
        'mysql',
        'postgresql'
      ]);
    });

    it('excludes memory connector', function() {
      var list = DataSourceService.getDiscoverableDatasourceConnectors();
      expect(list).to.not.include('memory');
    });
  });
});
