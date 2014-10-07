describe('StudioUserService', function() {
  var StudioUserService;

  beforeEach(function() {
    inject(function(_StudioUserService_) {
      StudioUserService = _StudioUserService_;
    });
  });

  describe('buildLoginRequest', function() {
    it('interprets nameOrEmail as an email', function() {
      var result = StudioUserService.buildLoginRequest({
        nameOrEmail: 'user@example.com'
      });

      expect(result).to.have.property('email', 'user@example.com');
    });

    it('interprets nameOrEmail as a user name', function() {
      var result = StudioUserService.buildLoginRequest({
        nameOrEmail: 'aName'
      });

      expect(result).to.have.property('username', 'aName');
    });

    it('includes password in the request', function() {
      var result = StudioUserService.buildLoginRequest({
        password: '12345'
      });

      expect(result).to.have.property('password', '12345');
    });
  });
});
