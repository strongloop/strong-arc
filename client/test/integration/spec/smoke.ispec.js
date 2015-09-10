describe('Arc', function() {
  beforeEach(given.emptyWorkspace);

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

  (window.__karma__.config.SKIP_MYSQL ?
   it.skip : it)('can autoupdate MySQL database', function() {

    // We need more time for tests to finish on Jenkins
    this.timeout(5000);

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
