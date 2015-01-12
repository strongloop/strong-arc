describe('IAService', function() {
  var CONST, IAService, $injector;
  beforeEach(function() {
    inject(function(_$injector_) {
      $injector = _$injector_;
      CONST = $injector.get('CONST');
      IAService = $injector.get('IAService');
    });
  });

  describe('.setGlobalException', function() {
    it('adds help message for missing connector error', function() {
      var err = new Error('Connector "mysql" is not installed.');
      err.name = 'InvocationError';
      err.code = 'ER_INVALID_CONNECTOR';
      err.request =
        '/workspace/api/DataSourceDefinitions/server.db/testConnection';
      err.status = 500;

      IAService.setGlobalException(err);

      var help = renderHelpAsString(err.help);
      expect(help).to.contain(
        'Add the connector to your project and try again.');
      expect(help).to.contain('http://docs.strongloop.com/display/LB/'+
      'Connecting+models+to+data+sources' +
      '#Connectingmodelstodatasources-Installingaconnector');
    });

    it('adds custom help message for missing Oracle connector', function() {
      var err = new Error('Connector "oracle" is not installed.');
      err.name = 'InvocationError';
      err.code = 'ER_INVALID_CONNECTOR';
      err.request =
        '/workspace/api/DataSourceDefinitions/server.db/testConnection';
      err.status = 500;

      IAService.setGlobalException(err);

      var help = renderHelpAsString(err.help);
      expect(help).to.contain('http://docs.strongloop.com/display/LB/' +
        'Installing+the+Oracle+connector');
    });

    function renderHelpAsString(help) {
      if (!Array.isArray(help)) return help;
      return help
        .map(function(fragment) {
          return fragment.link ?
            '[' + fragment.text + '](' + fragment.link + ')' :
            fragment.text;
        })
        .join(' ');
    }
  });
});
