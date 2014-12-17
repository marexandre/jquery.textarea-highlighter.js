// Karma configuration
module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 30 * 1000,
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'src/**/*.js',
      'spec/**/*.js'
    ],
    reporters: ['spec'],
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-benchmark',
      'karma-benchmark-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ]
  });
};
