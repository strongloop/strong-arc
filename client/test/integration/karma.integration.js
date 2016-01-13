// Karma configuration

module.exports = function(config) {

  // get the port from the environment, or default to the old hard-code value
  var testServerPort = process.env.TEST_SERVER_PORT || 9800;

  // tell the integration tests that there is no MySQL server setup
  config.client.SKIP_MYSQL = process.env.SKIP_MYSQL;

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../../..',


    // frameworks to use
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      // == ES5 shims for PhantomJS ==
      'node_modules/es5-shim/es5-shim.js',

      // == subset of scripts from client/www/index.html ==
      'client/www/scripts/vendor/jquery/dist/jquery.js',

      'client/www/scripts/vendor/angular/angular.js',
      'client/www/scripts/vendor/spin.js/spin.js',
      'client/www/scripts/vendor/angular-segmentio/angular-segmentio.js',
      'client/www/scripts/lib/segmentio/segmentio.js',
      'client/www/scripts/vendor/angular-ui-utils/ui-utils.js',
      'client/www/scripts/vendor/ng-file-upload/ng-file-upload.js',
      'client/www/scripts/vendor/ng-file-upload-shim/ng-file-upload-shim.js',
      'client/www/scripts/vendor/angular-nvd3/dist/angular-nvd3.js',
      'client/www/scripts/vendor/angular-ui-slider/src/slider.js',
      'client/www/scripts/vendor/angular-cookies/angular-cookies.js',
      'client/www/scripts/vendor/angular-animate/angular-animate.js',
'client/www/scripts/vendor/angular-ui-router/release/angular-ui-router.js',
      // 'client/www/scripts/vendor/angular-touch/angular-touch.js',
      'client/www/scripts/vendor/angular-spinner/angular-spinner.js',
      'client/www/scripts/vendor/angular-sanitize/angular-sanitize.js',
      'client/www/scripts/vendor/ng-grid/build/ng-grid.js',
      'client/www/scripts/vendor/checklist-model/checklist-model.js',
      'client/www/scripts/vendor/angular-bootstrap/ui-bootstrap.js',
      'client/www/scripts/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/www/scripts/vendor/angular-resource/angular-resource.js',
      'client/www/scripts/vendor/angular-growl/build/angular-growl.js',
      'client/www/scripts/vendor/angular-file-upload/angular-file-upload.js',
      'client/www/scripts/vendor/angular-moment/angular-moment.js',
      'client/www/scripts/vendor/stringjs/dist/string.js',

      'client/www/scripts/vendor/inflection/lib/inflection.js',
      'client/www/scripts/vendor/chance/chance.js',

      'client/www/scripts/vendor/d3/d3.js',
      'client/www/scripts/vendor/lodash/lodash.js',

      'client/www/scripts/vendor/nvd3/build/nv.d3.js',



      // NOTE(bajtos) the main app script is intentionally omitted:
      //  - it contains UI-specific code depending on jQuery
      //  - the angular part is not relevant for unit/integration tests
      //'client/www/scripts/app.js',

      // Order is important - *.module.js export a global function used
      // by other *.*.js files
      'client/www/scripts/modules/**/*.module.js',
      'client/www/scripts/modules/**/*.js',



      // == test support ==
      'client/test/integration/helpers/global-init.js',
      'client/test/integration/helpers/**/*.js',

      // == spec files ==
      'client/test/integration/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [
      'client/www/scripts/modules/tracing/src/**/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['mocha', 'junit', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      // 'client/www/scripts/modules/**/*.module.js': ['coverage'],
      'client/www/scripts/modules/**/*.js': ['coverage'],
    },

    coverageReporter: {
      type : 'cobertura',
      subdir: '.',
      dir : 'coverage/',
    },

    // CI friendly test output
    junitReporter: {
      outputFile: 'client-integration-xunit.xml'
    },


    // web server port
    // NOTE(jtary) This, as well as the test-server port, should be made
    // dynamic so that tests can be run concurrently without port conflicts.
    port: 9876,

    proxies: {
      '/': 'http://localhost:' + testServerPort + '/'
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values:
    //   config.LOG_DISABLE || config.LOG_ERROR ||
    //   config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests
    // whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; `npm install karma-ie-launcher`)
    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-mocha-reporter',
      'karma-junit-reporter',
      'karma-coverage',
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,

    // If browser is idle
    browserNoActivityTimeout: 20000,

    //preprocessors: {
    //  './e2e/**/*.spec.js': [ 'browserify' ]
    //},

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
