"use strict"

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
// const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');


var browserify = require("browserify");
var babelify = require("babelify");
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');


gulp.task("default", ["css","es6"])
// gulp.task("default", ["css","js"])


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





// gulp.task('js', () => {
//   // src/app.js
//     return gulp.src('main.js')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulp.dest('dist'));
// });


gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify, {presets: ["es2015"]})
		.require("./main.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('bundle.js'))
    	.pipe(gulp.dest('./dist'));
});


gulp.watch('css/master.css', ["css"]);
// gulp.watch('main.js', ["js"]);
gulp.watch(['*.js'],['es6']);
