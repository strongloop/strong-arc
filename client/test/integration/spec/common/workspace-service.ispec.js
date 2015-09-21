describe('WorkspaceService', function() {
  this.timeout(10000);
  var CONST, WorkspaceServices, throwHttpError, $injector;
  beforeEach(function() {
    inject(function(_$injector_) {
      $injector = _$injector_;
      CONST = $injector.get('CONST');
      WorkspaceServices = $injector.get('WorkspaceServices');
      throwHttpError = $injector.get('throwHttpError');
    });
  });

  describe('.validate', function() {
    it('returns true for a valid project', function() {
      return given.emptyWorkspace()
        .then(function() {
          return WorkspaceServices.validate();
        })
        .then(function(isValid) {
          expect(isValid).to.equal(true);
          expect(WorkspaceServices.validationError, 'validationError')
            .to.equal(null);
        });
    });

    it('throws an error when `server` facet is missing', function() {
      return given.emptyWorkspace()
        .then(function() {
          return given.facetIsMissing('server');
        })
        .then(function() {
          return WorkspaceServices.validate();
        })
        .catch(throwHttpError)
        .then(function(isValid) {
          expect(isValid, 'isValid').to.equal(false);
          var err = WorkspaceServices.validationError;
          expect(err.code, 'err.code').to.equal('E_INVALID_WORKSPACE');
          expect(err.message, 'err.message').to.contain('`server` facet');
        });
    });
  });
});
