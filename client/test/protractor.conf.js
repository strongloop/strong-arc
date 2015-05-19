exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./e2e/**/*.spec.js'],
  jasmineNodeOpts: {isVerbose: true},
  params: {
    pm: {
      host: process.env.TEST_PM_HOST,
      port: process.env.TEST_PM_PORT
    }
  }
};
