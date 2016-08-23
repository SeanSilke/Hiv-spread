"use strict"

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task("default", ["css","js"])


gulp.task('css', () =>
    gulp.src('css/master.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 20 version'],
            cascade: false
        }))
        // .pipe(concat('all.css'))
        .pipe(sourcemaps.write('.'))
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
