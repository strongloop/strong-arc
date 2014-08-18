var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mocha = require('gulp-spawn-mocha');
var runSequence = require('run-sequence');

var SOURCES = {
  SERVER_TESTS: 'server/test/*.js'
};

gulp.task('default', ['build', 'test']);

gulp.task('build', ['build-less']);

gulp.task('build-less', function(){
  return gulp.src('client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('client/www/style'));
});

gulp.task('test', ['build'], function(callback) {
  runSequence(
    'jshint',
    'test-backend',
     callback);
});

gulp.task('jshint', function() {
  return gulp.src([
    SOURCES.SERVER_TESTS,
    // TODO(bajtos) add more files once they pass the linter
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test-backend', function() {
  return gulp.src([SOURCES.SERVER_TESTS], { read: false })
    .pipe(mocha());
});
