var LoginView = (function () {
  var EC = protractor.ExpectedConditions;
  var testServer = 'http://127.0.0.1:' + (process.env.TEST_SERVER_PORT || 9800);

  function LoginView() {
    this.userNameInput = element(by.id('InputUserName'));
    this.passwordInput = element(by.id('InputPassword'));
    this.submitButton = element(by.id('login-user-btn'));

    this.openLoginView = function() {
      browser.get(testServer + '/#/login');
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
        loginBtn.click();
      });
    };

    this.loginAsFalseUser = function() {
      var self = this;
      var loginBtn = this.submitButton;
      browser.waitForAngular().then(function () {
        self.userNameInput.sendKeys('strongloop-test@grr.la');
        self.passwordInput.sendKeys('WrongPassword1234');
        loginBtn.click();
      });
    };

    this.loginToLandingView = function() {
      var loginAsTestUser = this.loginAsTestUser.bind(this);
      browser.get(testServer + '/#/login').then(function() {
        loginAsTestUser();
        browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
            return url === testServer + '/#/';
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
