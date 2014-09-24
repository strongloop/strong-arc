describe('Studio', function() {
  beforeEach(function() {
    return given.emptyWorkspace();
  });

  it('can get package definition', function() {
    return inject(function(PackageDefinition, throwHttpError) {
      var pkg = PackageDefinition.findOne();
      return pkg.$promise
        .then(function() {
          expect(pkg.name).to.equal('empty');
        })
        .catch(throwHttpError);
    });
  });

  it('can autoupdate MySQL database', function() {
    // Note: this test does not check the result of autoupdate,
    // it only verifies that the process finishes with no errors
    return inject(function(ModelService, throwHttpError) {
      return given.mysqlDataSource('mysql')
        .then(function() {
          var model = given.modelInstance(
            { name: 'TestModel' },
            { dataSource: 'mysql' });
          return ModelService.createModelInstance(model);
        })
        .then(function() {
          return ModelService.migrateModelConfig({
            name: 'TestModel',
            dataSource: 'mysql'
          });
        })
        .catch(throwHttpError);
    });
  });
});
