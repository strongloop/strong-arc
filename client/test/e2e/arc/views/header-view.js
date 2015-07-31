var ArcHeaderView = (function () {
  var EC = protractor.ExpectedConditions;

  function ArcHeaderView() {
    this.accountDropdown = element(
      by.css('span[data-id="ArcAccountDropdown"] a.dropdown-toggle'));
    this.logoutLink = element(by.id('arc-user-logout-btn'));
    this.homeLink = element(by.css('a[ui-sref="home"]'));

    this.logout = function() {
      browser.driver.wait(
        EC.presenceOf(this.accountDropdown),
      10000);
      browser.executeScript('window.scroll(0, 0);');
      browser.sleep(100);
      this.accountDropdown.click();
      browser.sleep(500);
      this.logoutLink.click();
      browser.driver.sleep(500);
      browser.waitForAngular();
    };

    this.navigateToLandingPage = function () {
      browser.driver.wait(
        EC.presenceOf(this.homeLink),
      10000);

      this.homeLink.click();

      browser.driver.wait(
        EC.presenceOf(element(by.css('.sl-app-icon-composer'))),
      10000);
    };
  }
  return ArcHeaderView;
})();

module.exports = ArcHeaderView;
