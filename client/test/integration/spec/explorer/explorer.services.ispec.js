describe('ExplorerService', function() {
  var $injector, CONST, ExplorerService, throwHttpError;

  beforeEach(function() {
    inject(function(_$injector_) {
      $injector = _$injector_;
      CONST = $injector.get('CONST');
      ExplorerService = $injector.get('ExplorerService');
      throwHttpError = $injector.get('throwHttpError');
    });
  });

  beforeEach(given.emptyWorkspace);
  afterEach(given.targetAppIsStopped);

  beforeEach(function configureUser() {
    var ModelConfig = $injector.get('ModelConfig');

    var userModelConfig = {
      facetName: CONST.APP_FACET,
      name: 'User',
      dataSource: null
    };

    return ModelConfig.create(userModelConfig).$promise;
  });

  it('returns correct Swagger metadata', function() {
    return given.targetAppIsRunning()
      .then(ExplorerService.getSwaggerResources.bind(ExplorerService))
      .catch(throwHttpError)
      .then(function(swagger) {
        expect(swagger).to.have.property('length', 1);

        expect(Object.keys(swagger[0]), 'propertyNames')
          .to.include.members(['basePath', 'apis']);

        expect(swagger[0].basePath, 'basePath')
          .to.equal('http://localhost:3000/api');
        expect(swagger[0].apis).to.an('array');
      });
  });

  it('builds correct swagger URL', function() {
    return given.facetConfig('server', {
      restApiRoot: '/rest',
      host: '127.0.0.1',
      port: 3030
    })
      .then(given.targetAppIsRunning)
      .then(ExplorerService.getSwaggerResources.bind(ExplorerService))
      .catch(throwHttpError)
      .then(function(swagger) {
        expect(swagger).to.have.property('length', 1);
        expect(swagger[0].basePath).to.equal('http://127.0.0.1:3030/rest');
      });
  });

  it('returns descriptive error when the app is not running', function() {
    given.targetAppIsStopped()
      .then(ExplorerService.getSwaggerResources.bind(ExplorerService))
      .then(function() {
        throw new Error('getSwaggerResources should have failed');
      })
      .catch(function(err) {
        expect(err.message).to.contain('not running');
      });
  });
});
