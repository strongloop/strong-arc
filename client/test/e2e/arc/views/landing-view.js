var LandingView = (function () {
  var EC = protractor.ExpectedConditions;
  var testServer = 'http://127.0.0.1:' + (process.env.TEST_SERVER_PORT || 9800);
  function LandingView() {
    this.landingTitle  = element(by.css('.landing-title'));
    this.composerAppCommand = element(
      by.css('.sl-app a[ui-sref="composer"]'));
    this.buildDeployAppCommand = element(
      by.css('.sl-app a[ui-sref="build-deploy"]'));
    this.processManagerAppCommand = element(
      by.css('.sl-app a[ui-sref="process-manager"]'));
    this.metricsAppCommand = element(
      by.css('.sl-app a[ui-sref="metrics"]'));
    this.tracingAppCommand = element(
      by.css('.sl-app a[ui-sref="tracing"]'));
    this.profilerAppCommand = element(
      by.css('.sl-app a[ui-sref="profiler"]'));

    this.openComposerView = function() {
      browser.driver.wait(
        EC.presenceOf(this.composerAppCommand),
      10000);
      this.composerAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('.ia-project-title-header-container'))
        ),
      10000);
    };

    this.openBuildDeployView = function() {
      browser.driver.wait(
        EC.presenceOf(this.buildDeployAppCommand),
      10000);
      this.buildDeployAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('button[ng-disabled="deployId == \'existing\'"]'))
        ),
      10000);
    };

    this.openProcessManagerView = function() {
      browser.driver.wait(
        EC.presenceOf(this.processManagerAppCommand),
      10000);
      this.processManagerAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('button[ng-click="initAddNewPMHost()"]'))
        ),
      10000);
    };

    this.openMetricsView = function() {
      browser.driver.wait(
        EC.presenceOf(this.metricsAppCommand),
      10000);
      this.metricsAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('div .metrics-main-container'))
        ),
      10000);
    };

    this.openTracingView = function() {
      browser.driver.wait(
        EC.presenceOf(this.tracingAppCommand),
      10000);
      this.tracingAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('sl-tracing-header'))
        ),
      10000);
    };

    this.openProfilerView = function() {
      browser.driver.wait(
        EC.presenceOf(this.profilerAppCommand),
      10000);
      this.profilerAppCommand.click();
      browser.driver.wait(
        EC.presenceOf(
          element(by.css('div[ng-controller="ProfilerMainController"]'))
        ),
      10000);
    };

    this.waitUntilLoaded = function() {
      var port =
      browser.get(testServer + '/#/');
      browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return url === testServer + '/#/';
        });
      }, 20000);
      browser.waitForAngular();
    };

    this.get = function() {
      browser.get(testServer + '/#/');
    };
  }
  return LandingView;
})();

module.exports = LandingView;
