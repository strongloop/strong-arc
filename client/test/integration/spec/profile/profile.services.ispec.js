describe('ProfileService', function() {
  var ProfileService;

  beforeEach(function() {
    inject(function(_ProfileService_) {
      ProfileService = _ProfileService_;
    });
  });

  describe('buildLoginRequest', function() {
    it('interprets nameOrEmail as an email', function() {
      var result = ProfileService.buildLoginRequest({
        nameOrEmail: 'user@example.com'
      });

      expect(result).to.have.property('email', 'user@example.com');
    });

    it('interprets nameOrEmail as a user name', function() {
      var result = ProfileService.buildLoginRequest({
        nameOrEmail: 'aName'
      });

      expect(result).to.have.property('username', 'aName');
    });

    it('includes password in the request', function() {
      var result = ProfileService.buildLoginRequest({
        password: '12345'
      });

      expect(result).to.have.property('password', '12345');
    });
  });
});
