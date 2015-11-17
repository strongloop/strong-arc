exports.config = {
  // XXX: using direct connection bypasses selenium and avoids the Java dependnecies
  //      but I'm not sure what side effects that has, if any
  directConnect: true,
  // seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  specs: ['./e2e/**/*.spec.js'],
  framework: 'jasmine2',
  jasmineNodeOpts: {isVerbose: true},
  params: {
    pm: {
      host: process.env.TEST_PM_HOST,
      port: process.env.TEST_PM_PORT
    }
  },
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        filePrefix: 'e2e-tests-xunit',
    }));

    var EC = protractor.ExpectedConditions;
    var testServer = 'http://127.0.0.1:' +
      (process.env.TEST_SERVER_PORT || 9800);

    // First page load takes a while, so wait for it before even starting tests
    // HACK: this little load/delay/load saves about 10 seconds of spinning
    // load, check, sleep, until the page loads
    return browser.driver.wait(EC.or(EC.and(goHome, isHome), sleep), 10000);

    function goHome() {
      return browser.driver.get(testServer + '/#/login');
    }

    function isHome() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return url === testServer + '/#/login';
      });
    }

    function sleep() {
      return browser.sleep(500);
    }
  }
  // capabilities: {
  // 'browserName': 'firefox'
  // }
};
