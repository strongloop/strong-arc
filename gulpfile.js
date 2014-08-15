var gulp = require('gulp');
var less = require('gulp-less');
var mocha = require('gulp-spawn-mocha');

gulp.task('default', ['build-less', 'test']);

gulp.task('build-less', function(){
  return gulp.src('client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('client/www/style'));
});

gulp.task('test', ['test-backend']);

gulp.task('test-backend', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha());
});
