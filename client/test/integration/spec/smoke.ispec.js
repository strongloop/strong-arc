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
});
