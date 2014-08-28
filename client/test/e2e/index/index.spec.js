// Copyright StrongLoop 2014
describe('hello-protractor', function() {
  var ptor = protractor.getInstance();

  describe('index', function() {
    it('should display teh correct title', function() {
      ptor.get('/#');
      expect(ptor.getTitle()).toBe('StrongLoop API Studio [prototype]');
    });
  });
});
