// Karma configuration
module.exports = function(config) {
  config.set({
    captureTimeout: 600 * 1000,
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    frameworks: ['benchmark'],
    files: [
      'src/helper.js',
      'src/trie.js',
      'benchmark/helper.js',
      'benchmark/**/*.js',
      'benchmark/benchmark.js'
    ],
    reporters: ['benchmark'],
    plugins: [
      'karma-benchmark',
      'karma-benchmark-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ]
  });
};
