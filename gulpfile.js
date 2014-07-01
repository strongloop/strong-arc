var gulp = require('gulp');
var less = require('gulp-less');
gulp.task('build-less', function(){
  return gulp.src('client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('client/www/style'));
});
