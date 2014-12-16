var inject;

angular.module('test', ['Arc'])
  .provider({
    // mock a fresh new root element for every test
    $rootElement: function RootElementProvider() {
      this.$get = function() {
        return angular.element('<div ng-app></div>');
      };
    }
  })
  .value('throwHttpError', function throwHttpError(res) {
    if (res instanceof Error) throw res;
    if (!(res.status && res.headers)) throw res;

    var msg = 'HTTP ' + res.status;
    if (res.data && res.data.error && res.data.error.message)
      msg += ' ' + res.data.error.message;
    msg += ' [' + res.config.method + ' ' +res.config.url + ']';

    var details = res.data && res.data.error && res.data.error.details;
    if (details)
      msg += '\nDetails: ' + JSON.stringify(details, null, 2);

    throw new Error(msg);
  });

beforeEach(function setupInject() {
  var $injector = angular.injector(['test']);
  inject = function(blockFn) {
    return $injector.invoke(blockFn, this);
  };
});

beforeEach(function clearAppStorage() {
  return inject(function(AppStorageService) {
    AppStorageService.clearStorage();
  });
});


