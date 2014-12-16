describe('ArcUserService', function() {
  var ArcUserService;

  beforeEach(function() {
    inject(function(_ArcUserService_) {
      ArcUserService = _ArcUserService_;
    });
  });

  describe('buildLoginRequest', function() {
    it('interprets nameOrEmail as an email', function() {
      var result = ArcUserService.buildLoginRequest({
        nameOrEmail: 'user@example.com'
      });

      expect(result).to.have.property('email', 'user@example.com');
    });

    it('interprets nameOrEmail as a user name', function() {
      var result = ArcUserService.buildLoginRequest({
        nameOrEmail: 'aName'
      });

      expect(result).to.have.property('username', 'aName');
    });

    it('includes password in the request', function() {
      var result = ArcUserService.buildLoginRequest({
        password: '12345'
      });

      expect(result).to.have.property('password', '12345');
    });
  });
});
