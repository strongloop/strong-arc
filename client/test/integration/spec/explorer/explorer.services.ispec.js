describe('ExplorerService', function() {
  var $injector, CONST, ExplorerService, throwHttpError;

  // Starting a process on Jenkins is slow,
  // we need more time for tests to finish
  this.timeout(5000);

  beforeEach(function() {
    inject(function(_$injector_) {
      $injector = _$injector_;
      CONST = $injector.get('CONST');
      ExplorerService = $injector.get('ExplorerService');
      throwHttpError = $injector.get('throwHttpError');
    });
  });

  beforeEach(given.emptyWorkspace);

  beforeEach(function setupServerPort() {
    var test = this;
    return given.uniqueServerPort()
      .then(function(port) {
        test.serverPort = port;
      });
  });

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

        expect(swagger[0].apis).to.be.an('array');
      });
  });

  it('builds correct swagger URL', function() {
    var serverConfig = {
      restApiRoot: '/rest',
      host: '127.0.0.1'
    };

    var expectedUrl ='http://' + serverConfig.host + ':' + this.serverPort +
      serverConfig.restApiRoot;

    return given.facetConfig('server', serverConfig)
      .then(given.targetAppIsRunning)
      .then(ExplorerService.getSwaggerResources.bind(ExplorerService))
      .catch(throwHttpError)
      .then(function(swagger) {
        expect(swagger).to.have.property('length', 1);
        expect(swagger[0].basePath).to.equal(expectedUrl);
      });
  });

  it('ensures the app is running', function() {
    return given.targetAppIsStopped()
      .then(ExplorerService.getSwaggerResources.bind(ExplorerService))
      .catch(throwHttpError);
  });
});
