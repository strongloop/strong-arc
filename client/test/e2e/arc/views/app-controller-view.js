var AppControllerView = (function () {
  var EC = protractor.ExpectedConditions;

  function AppControllerView() {
    var wait = 10000;
    this.statusStoppedDisplay = element(
      by.css('div.stopped'));
    this.statusRunningDisplay = element(
      by.css('div.running'));
    this.appStartButton = element(
      by.css('button[data-action="start"]'));
    this.appStopButton = element(
      by.css('button[data-action="stop"]'));

    this.startStopApp = function() {
      browser.driver.wait(
        EC.presenceOf(this.statusStoppedDisplay),
        wait);
      browser.driver.wait(
        EC.presenceOf(this.appStartButton),
        wait);
      this.appStartButton.click();
      browser.driver.wait(
        EC.presenceOf(this.statusRunningDisplay),
        wait);
      browser.driver.wait(
        EC.presenceOf(this.appStopButton),
        wait);
      this.appStopButton.click();
      browser.driver.wait(
        EC.presenceOf(this.statusStoppedDisplay),
        wait);
    };

  }
  return AppControllerView;
})();

module.exports = AppControllerView;
