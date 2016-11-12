var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('sass', function(){
    return gulp.src('src/stylesheets/global.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
});

gulp.task('css', ['sass'], function(){
    return gulp.src([
        'public/css/global.css'
    ])
    .pipe(concat('global.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
});

gulp.task('js', function (cb) {

    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'src/js/*.js'
    ])
    .pipe(concat('global.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename('global.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('default', ['sass', 'css', 'js']);