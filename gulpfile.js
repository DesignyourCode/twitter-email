var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify');

var paths = {

    styles: {
        src: './public/stylesheets/',
        files: './sass/**/*.scss',
        dest: './public/stylesheets/'
    }

}

gulp.task('sass', function() {
  gulp.src(paths.styles.files)
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [paths.styles.src],
      errLogToConsole: true
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(livereload());
});

gulp.task('img', function() {
  gulp.src(['./assets/img/*.*'])
    .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src('./assets/lib/*.js')
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch(paths.styles.files, ['sass']);
  gulp.watch('./assets/lib/*.js', ['js']);
  gulp.watch('./assets/img/*.*', ['img']);

  livereload.listen();
});

gulp.task('default', ['watch']);