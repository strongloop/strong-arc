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
    it('removes internal Arc properties', function() {
      var instance = given.dataSourceInstance();
      expect(instance).to.have.property('id');

      IAService.setActiveInstance(instance, CONST.DATASOURCE_TYPE);

      return DataSourceService.createDataSourceInstance(instance)
        .then(function(created) {
          expect(created).to.have.property('id');
          expect(created).to.have.property('name');
          expect(created).to.have.property('definition');
          DataSourceService.getDataSourceInstanceById(created.id)
            .then(function(found) {
              expect(found).to.have.property('type');
              expect(found).to.have.property('definition');
              expect(found.definition).to.not.have.property('type');
            });
        });
      });
    });

    describe('.updateDataSourceInstance()', function() {
      it('removes internal Arc properties on update', function() {
        var instance = given.dataSourceInstance();
        expect(instance).to.have.property('id');
        return DataSourceService.createDataSourceInstance(instance)
          .then(function(created) {
            expect(created).to.have.property('id');
            expect(created).to.have.property('name');
            expect(created).to.have.property('definition');
            // setActiveInstance used to add `type` property
            IAService.setActiveInstance(created, CONST.DATASOURCE_TYPE);

            return DataSourceService.updateDataSourceInstance(created);
          })
          .then(function(updated) {
            DataSourceService.getDataSourceInstanceById(updated.id)
              .then(function(found) {
                expect(found).to.have.property('type');
                expect(found).to.have.property('definition');
                expect(found.definition).to.not.have.property('type');
              });
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
