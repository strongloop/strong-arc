var LoginView = (function () {
  var EC = protractor.ExpectedConditions;

  function LoginView() {
    this.userNameInput = element(by.id('InputUserName'));
    this.passwordInput = element(by.id('InputPassword'));
    this.submitButton = element(by.id('login-user-btn'));

    this.openLoginView = function() {
      browser.get('http://127.0.0.1:9800/#/login');
      browser.ignoreSynchronization = true;
      var loginBtn = this.submitButton;
      browser.driver.wait(
        EC.visibilityOf(loginBtn),
      10000);
    };

    this.loginAsTestUser = function() {
      var self = this;
      var loginBtn = this.submitButton;
      browser.waitForAngular().then(function () {
        self.userNameInput.sendKeys('strongloop-test@grr.la');
        self.passwordInput.sendKeys('Str0ngL00p');
        browser.ignoreSynchronization = true;
        loginBtn.click();
      });
    };

    this.loginAsFalseUser = function() {
      var self = this;
      var loginBtn = this.submitButton;
      browser.waitForAngular().then(function () {
        self.userNameInput.sendKeys('strongloop-test@grr.la');
        self.passwordInput.sendKeys('WrongPassword1234');
        browser.ignoreSynchronization = true;
        loginBtn.click();
      });
    };

    this.loginToLandingView = function() {
      var loginAsTestUser = this.loginAsTestUser.bind(this);
      browser.get('http://127.0.0.1:9800/#/login').then(function() {
        loginAsTestUser();
        browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
            return url === 'http://127.0.0.1:9800/#/';
          });
        }, 10000);
        browser.driver.wait(
          EC.presenceOf(element(by.css('.sl-landing-page'))),
        10000);
      });
    };
  }

  return LoginView;

})();

module.exports = LoginView;
