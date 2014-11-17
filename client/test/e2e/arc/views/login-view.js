var LoginView = (function () {
  function LoginView() {
    this.userNameInput = element(by.id('InputUserName'));
    this.passwordInput = element(by.id('InputPassword'));
    this.submitButton = element(by.css('.btn-primary'));

    this.openLoginView = function() {
      var ptor = protractor.getInstance();
      ptor.get('http://127.0.0.1:9800/#/login');
    };
    this.loginAsTestUser = function() {
      this.userNameInput.sendKeys('strongloop-test@grr.la');
      this.passwordInput.sendKeys('Str0ngL00p');
      this.submitButton.click();
    };
    this.loginToLandingView = function() {
      var ptor = protractor.getInstance();
      ptor.get('http://127.0.0.1:9800/#/login');
      this.loginAsTestUser();
    };
  }


  return LoginView;

})();

module.exports = LoginView;
