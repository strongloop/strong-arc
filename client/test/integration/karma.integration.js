// Karma configuration

module.exports = function(config) {
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
      'client/www/scripts/vendor/jquery/jquery-2.0.0.js',

      'client/www/scripts/vendor/angular/angular.js',

      // Exclude react & jsx until we rename jsx files to .jsx
      // (see the comment in `exclude` section below)
      // 'client/www/scripts/vendor/react/react-addon.0.10.0.js',
      // 'client/www/scripts/vendor/react/JSXTransformer.js',
      'client/www/scripts/vendor/spin.js',
      'client/www//scripts/vendor/angular-segmentio/angular-segmentio.js',
      'client/www//scripts/vendor/segmentio/segmentio.js',
      'client/www/scripts/vendor/angular/ui-utils.js',
      'client/www/scripts/vendor/angular/angular-file-upload-shim.js',
      'client/www/scripts/vendor/angular/angular-nvd3.js',
      'client/www/scripts/vendor/angular/slider.js',
      'client/www/scripts/vendor/angular/angular-cookies.js',
      'client/www/scripts/vendor/angular/angular-animate.js',
      'client/www/scripts/vendor/angular/angular-ui-router.js',
      // 'client/www/scripts/vendor/angular/angular-touch.js',
      'client/www/scripts/vendor/angular/angular-spinner.js',
      'client/www/scripts/vendor/angular/angular-sanitize.js',
      'client/www/scripts/vendor/angular/ng-grid.js',
      'client/www/scripts/vendor/angular/checklist-model.js',
      'client/www/scripts/vendor/angular/ui-bootstrap.js',
      'client/www/scripts/vendor/angular/ui-bootstrap-tpls.js',
      'client/www/scripts/vendor/angular/angular-resource.js',
      'client/www/scripts/vendor/angular/angular-growl.min.js',
      'client/www/scripts/vendor/angular/angular-file-upload.js',

      'client/www/scripts/vendor/string.min.js',

      'client/www/scripts/vendor/inflection.min.js',
      'client/www/scripts/vendor/chance.js',

      'client/www/scripts/vendor/d3.js',
      'client/www/scripts/vendor/lodash.js',

      'client/www/scripts/vendor/nv.d3.js',

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
      // TODO(bajtos) Rename react scripts to *.jsx
      // and use karma-react-jsx-preprocessor
      'client/www/scripts/modules/**/*.react.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['mocha', 'junit'],

    // CI friendly test output
    junitReporter: {
      outputFile: 'client-integration-xunit.xml'
    },


    // web server port
    port: 9876,

    proxies: {
      // NOTE(bajtos) The port 9800 is hard-coded in test-server.js
      '/': 'http://localhost:9800/'
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
      'karma-junit-reporter'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
