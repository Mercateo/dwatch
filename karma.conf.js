var path = require('path');

module.exports = function(config) {
  config.set({

    basePath: './app/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'source-map-support' ],


    // list of files / patterns to load in the browser
    files: [
      path.join('node_modules', 'babel-polyfill', 'dist', 'polyfill.min.js'),
      path.join('node_modules', 'reflect-metadata', 'Reflect.js'),
      'generated/tests.js'
    ],


    plugins: [
      'karma-mocha',
      'karma-source-map-support',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-electron'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'generated/tests.js': [ 'electron', 'sourcemap', 'coverage' ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'progress', 'coverage' ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ 'Electron' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter: {
      reporters: [
        {
          type: 'json',
          dir: 'generated',
          subdir: '.',
          file: 'coverage.json'
        }
      ]
    }
  })
};
