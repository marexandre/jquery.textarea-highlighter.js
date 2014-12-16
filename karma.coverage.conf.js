// Karma configuration
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'src/**/*.js',
      'spec/**/*.js'
    ],
    reporters: ['coverage'],
    preprocessors: {
      'src/**/*.js': 'coverage'
    },
    coverageReporter: {
      reporters:[
        { type: 'html', dir: './coverage' },
        { type: 'text-summary' }
      ]
    },
    plugins: [
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ]
  });
};