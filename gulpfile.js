var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author.name %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var karma = require('karma').server;

var paths = {
  src: './src/**/*.js'
};

gulp.task('compress', function() {
  return gulp.src([ 'src/helper.js', 'src/trie.js', 'src/' + pkg.name ])
    .pipe(concat(pkg.name))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename(pkg.name.replace('.js', '.min.js')))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./'));
});

gulp.task('jscs', function() {
  return gulp.src(paths.src)
    .pipe(jscs());
});

gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
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

// Watch file changes
gulp.task('watch', function() {
  gulp.watch(paths.src, ['jscs', 'lint']);
});


gulp.task('dev', ['watch', 'tdd']);
gulp.task('build', ['jscs', 'lint', 'test', 'compress']);
