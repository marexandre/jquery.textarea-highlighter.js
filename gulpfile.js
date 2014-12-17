var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var karma = require('karma').server;

var paths = {
  src: './src/**/*.js'
};

gulp.task('jscs', function() {
  return gulp.src(paths.src)
    .pipe(jscs());
});

gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Generate test coverage
gulp.task('benchmark', function (done) {
  karma.start({
    configFile: __dirname + '/karma.benchmark.conf.js',
    singleRun: true
  }, done);
});

// Generate test coverage
gulp.task('coverage', function (done) {
  karma.start({
    configFile: __dirname + '/karma.coverage.conf.js',
    singleRun: true
  }, done);
});

// Run test once and exit
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// Watch file changes
gulp.task('watch', function() {
  gulp.watch(paths.src, ['jscs', 'lint']);
});


gulp.task('dev', ['watch', 'tdd']);
