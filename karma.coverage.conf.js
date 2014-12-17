// Karma configuration
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
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
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ]
  });
};
