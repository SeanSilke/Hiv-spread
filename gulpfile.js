"use strict"

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

gulp.task("default", ["css","js"])

gulp.task('css', () =>
    gulp.src('css/master.css')
        .pipe(autoprefixer({
            browsers: ['last 20 version'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);



gulp.task('js', () => {
  // src/app.js
    return gulp.src('main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.watch('css/master.css', ["css"]);
gulp.watch('main.js', ["js"]);
