// Karma configuration
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'src/**/*.js',
      'test/**/*.js'
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ],
    reporters: ['spec']
  });
};
