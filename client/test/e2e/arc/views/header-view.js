var ArcHeaderView = (function () {
  var EC = protractor.ExpectedConditions;

  function ArcHeaderView() {
    this.accountDropdown = element(
      by.css('span[data-id="ArcAccountDropdown"] a.dropdown-toggle'));
    this.appControllerDropdown = element(
      by.css('.header-pm-app-control-menu-item'));
    this.logoutLink = element(by.id('arc-user-logout-btn'));

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

    this.openAppController = function() {
      browser.driver.wait(
        EC.presenceOf(this.appControllerDropdown),
        10000);
      browser.executeScript('window.scroll(0, 0);');
      browser.driver.sleep(100);
      this.appControllerDropdown.click();
      browser.waitForAngular();

    };
  }
  return ArcHeaderView;
})();

module.exports = ArcHeaderView;
