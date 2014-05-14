var gulp = require('gulp');
var less = require('gulp-less');
gulp.task('build-less', function(){
  return gulp.src('client/less/bootstrap-src/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('client/www/style'));
});
