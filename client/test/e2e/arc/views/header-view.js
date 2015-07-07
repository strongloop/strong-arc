var ArcHeaderView = (function () {
  function ArcHeaderView() {
    this.accountDropdown = element(
      by.css('span[data-id="ArcAccountDropdown"] a.dropdown-toggle'));
    this.logoutLink = element(by.id('arc-user-logout-btn'));

    this.logout = function() {
      var self = this;
      browser.driver.wait(function() {
        return self.accountDropdown.isPresent();
      }, 10000);
      browser.executeScript('window.scroll(0, 0);');
      browser.sleep(100);
      self.accountDropdown.click();
      browser.sleep(500);
      self.logoutLink.click();
      browser.driver.sleep(500);
      browser.waitForAngular();
    };
  }
  return ArcHeaderView;
})();

module.exports = ArcHeaderView;
