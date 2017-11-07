var gulp = require('gulp')
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
var runSequence = require('run-sequence')
var del = require('del')
var htmlmin = require('gulp-htmlmin')
var notify = require('gulp-notify')
var postcss = require('gulp-postcss')
var concat = require('gulp-concat')
var minifycss = require('gulp-minify-css')
var rename = require('gulp-rename')
var autoprefixer = require('autoprefixer')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')

var cssProcess = [
	autoprefixer({ browsers: ['last 200 versions'], cascade: false })
]



/*================= clean =====================*/

/**
 * clean:css-styles
 * ------------------
 */
gulp.task('clean:css-styles', function() {
	return del(['dist/css/*.*'])
})

/**
 * clean:css-font
 * ----------------
 */
gulp.task('clean:css-font', function() {
	return del(['dist/css/font/*.css'])
})

/**
 * clean:js-scripts
 * --------------------
 */
gulp.task('clean:js-scripts', function() {
	return del(['dist/js/*.*'])
})

/**
 * clean:js-vender
 * --------------------
 */
gulp.task('clean:js-vender', function() {
	return del(['dist/js/vender/*.js'])
})

/**
 * clean-images
 * ------------------
 */
gulp.task('clean:images', function() {
	return del(['dist/images'])
})



/*================= assets get =====================*/

/**
 * assets favicon
 * ----------------
 */
gulp.task('assets-favicon', function() {
	return gulp.src('favicon.ico')
	           .pipe( gulp.dest('dist') )
	           .pipe(notify({ message: 'assets favicon ok' }))
})

/**
 * assets:font
 * ---------------
 */
gulp.task('assets:font', function() {
	return gulp.src('src/css/font/**/*')
						 .pipe( gulp.dest('dist/css/font') )
						 .pipe(notify({ message: 'assets font ok' }))
})

/**
 * assets download
 * ---------------------
 */
gulp.task('assets-download', function() {
	return gulp.src('download/*')
	           .pipe( gulp.dest('dist/download') )
	           .pipe(notify({ message: 'assets download ok' }))
})

/**
 * assets get
 * ------------
 */
gulp.task('assets-get', function(callback) {
	runSequence(
		['assets-favicon'],
		['assets:font'],
		['assets-download'],
	callback)
})



/*================= images =====================*/

/**
 * images
 * ----------------
 */
gulp.task('images', function() {
	return gulp.src('src/images/*')
	           .pipe(imagemin([
	           		imagemin.gifsicle({ interlaced: true }),
	           		imagemin.jpegtran({ progressive: true }),
	           		imagemin.optipng({ optimizationLevel: 5 })
	           	], {verbose: true}))
	           .pipe(rev())
	           .pipe( gulp.dest('dist/images') )
	           .pipe(rev.manifest())
	           .pipe( gulp.dest('rev/images') )
})



/*================= css =====================*/

/**
 * css:styles
 * ----------------
 */
gulp.task('css:styles', function() {
	return gulp.src('src/css/*.css')
						 .pipe(postcss(cssProcess))
						 .pipe(concat('styles.css'))
						 .pipe( gulp.dest('dist/css') )
						 .pipe(minifycss())
						 .pipe(rename({ suffix: '.min' }))
						 .pipe( gulp.dest('dist/css') )
						 .pipe(notify({ message: 'css styles ok' }))				
})

/**
 * css:font
 * ----------------
 */
gulp.task('css:font', function() {
	return gulp.src('src/css/font/*.css')
	           .pipe(minifycss())
	           .pipe(rename({ suffix: '.min' }))
	           .pipe( gulp.dest('dist/css/font') )
	           .pipe(notify({ message: 'css font ok' }))	
})

/**
 * css-rev
 * ---------
 */
gulp.task('css-rev', function() {
	return gulp.src(['dist/css/**/*.min.css'])
						 .pipe(rev())
						 .pipe( gulp.dest('dist/css') )
						 .pipe(rev.manifest())
						 .pipe( gulp.dest('rev/css') )
						 .pipe(notify({ message: 'css rev ok' }))
})

/**
 * merge:css-rev
 * --------------------
 */
gulp.task('merge:css-rev', function(callback) {
	runSequence(
		['css:styles', 'css:font'],
		['css-rev'],
	callback)
})



/*================= js =====================*/

/**
 * js:vender
 * ----------------
 */
gulp.task('js:vender', function() {
	return gulp.src('src/js/vender/*.js')
					   .pipe(concat('vender.js'))
					   .pipe( gulp.dest('dist/js/vender') )
					   .pipe(uglify())
					   .pipe(rename({ suffix: '.min' }))
					   .pipe( gulp.dest('dist/js/vender') )
						 .pipe(notify({ message: 'js vender ok' }))	
})

/**
 * js:scripts
 * ----------------
 */
gulp.task('js:scripts', function() {
	return gulp.src('src/js/*.js')
						 .pipe(concat('scripts.js'))
						 .pipe( gulp.dest('dist/js') )
						 .pipe(uglify())
						 .pipe(rename({ suffix: '.min' }))
						 .pipe( gulp.dest('dist/js') )
						 .pipe(notify({ message: 'js scripts ok' }))	
})

/**
 * js-rev
 * ---------
 */
gulp.task('js-rev', function() {
	return gulp.src(['dist/js/**/*.min.js'])
				     .pipe(rev())
				     .pipe( gulp.dest('dist/js') )
				     .pipe(rev.manifest())
				     .pipe( gulp.dest('rev/js') )
				     .pipe(notify({ message: 'js rev ok' }))
})

/**
 * merge:js-rev
 * -----------------
 */
gulp.task('merge:js-rev', function(callback) {
	runSequence(
		['js:vender', 'js:scripts'],
		['js-rev'],
	callback)
})



/*================= rev-collector =====================*/

/**
 * rev-collector:html
 * ----------------------
 */
gulp.task('rev-collector:html', function() {
	return gulp.src(['rev/**/*.json', './**/*.html', '!node_modules/**/*', '!dist/**/*'])
						 .pipe(revCollector({
						 		replaceReved: true,
						 		dirReplacements: {
						 			'./dist/css'          : './css',
						 			'./dist/css/font'     : './css/font',
						 			'../dist/css'         : '../css',
						 			'../dist/css/font'    : '../css/font',
						 			'../../dist/css'      : '../../css',
						 			'../../dist/css/font' : '../../css/font',
						 			'./dist/js'           : './js',
						 			'./dist/js/vender'    : './js/vender',
						 			'../dist/js'          : '../js',
						 			'../dist/js/vender'   : '../js/vender',
						 			'../../dist/js'       : '../../js',
						 			'../../dist/js/vender': '../../js/vender',
						 			'./src/images'        : './images',
						 			'../src/images'       : '../images',
						 			'../../images'        : '../../images',			 			
						 		}
						 }))
						 .pipe( gulp.dest('dist') )
						 .pipe(notify({ message: 'rev collector html ok' }))	
})

/**
 * rev-images:css
 * ---------------------
 */
gulp.task('rev-images:css', function() {
	return gulp.src(['rev/images/*.json', 'dist/css/*.css'])
						 .pipe(revCollector({
						 		replaceReved: true
						 }))
						 .pipe( gulp.dest('dist/css') )
						 .pipe(notify({ message: 'rev images css ok' }))
})

/**
 * rev-images:js-scripts-develop
 * -------------------------------
 */
gulp.task('rev-iamges:js-scripts-develop', function() {
	return gulp.src(['rev/images/*.json', 'dist/js/scripts.min.js'])
						 .pipe(revCollector({
						 		replaceReved: true,
						 		dirReplacements: {
						 			'./src/images'   : './dist/images',
						 			'../src/images'   : '../dist/images',
						 			'../../src/images': '../../dist/images',
						 		}						 		
						 }))
						 .pipe( gulp.dest('dist/js') )
						 .pipe(notify({ message: 'rev images js scripts develop ok ' }))	
})

/**
 * rev-images:js-dist
 * -------------------------
 */
gulp.task('rev-images:js-dist', function() {
	return gulp.src(['rev/images/*.json', 'dist/js/*.js', '!dist/js/scripts.min.js'])
						 .pipe(revCollector({
						 		replaceReved: true,
						 		dirReplacements: {
						 			'./src/images'    : './images',
						 			'../src/images'   : '../images',
						 			'../../src/images': '../../images',
						 		}						 		
						 }))
						 .pipe( gulp.dest('dist/js') )
						 .pipe(notify({ message: 'rev images js dist ok ' }))	
})

/**
 * rev-images:js
 * --------------------
 */
gulp.task('rev-images:js', function(callback) {
	runSequence(
		['rev-iamges:js-scripts-develop', 'rev-images:js-dist'],
	callback)
})


/**
 * rev-collector
 * ----------------
 */
gulp.task('rev-collector', function(callback) {
	runSequence(
		['rev-collector:html'],
		['rev-images:css', 'rev-images:js'],
	callback)
})



/*================= watch =====================*/

/**
 * watch assets
 * ----------------
 */
gulp.task('watch', function() {
	gulp.watch('src/css/font/*.css', ['watch:css-font'])
	gulp.watch('src/css/*.css', ['watch:css-styles'])
	gulp.watch('src/js/*.js', ['watch:js-scripts'])
	gulp.watch('src/js/vender/*.js', ['watch:js-vender'])
})

/**
 * watch:css-font
 * -------------------
 */
gulp.task('watch:css-font', function(callback) {
	runSequence(
		['clean:css-font', 'clean:css-styles'],
		['merge:css-rev'],
		['rev-collector:html'],
		['rev-images:css'],
	callback)
})

/**
 * watch:css-styles
 * -------------------
 */
gulp.task('watch:css-styles', function(callback) {
	runSequence(
		['clean:css-styles', 'clean:css-font'],
		['merge:css-rev'],
		['rev-collector:html'],
		['rev-images:css'],
	callback)
})

/**
 * watch:js-vender
 * -------------------
 */
gulp.task('watch:js-vender', function(callback) {
	runSequence(
		['clean:js-vender', 'clean:js-scripts'],
		['merge:js-rev'],
		['rev-collector:html'],
		['rev-images:js'],		
	callback)
})

/**
 * watch:js-scripts
 * -------------------
 */
gulp.task('watch:js-scripts', function(callback) {
	runSequence(
		['clean:js-scripts', 'clean:js-vender'],
		['merge:js-rev'],
		['rev-collector:html'],
		['rev-images:js'],
	callback)
})



/*================= process =====================*/

/**
 * mini html
 * -----------
 */
gulp.task('min-html', function() {
	return gulp.src('dist/**/*.html')
			       .pipe(htmlmin({ collapseWhitespace: true }))
			       .pipe( gulp.dest('dist') )
			       .pipe(notify({ message: 'mini html ok' }))
})

/**
 * init
 * -------------
 */
gulp.task('init', function(callback) {
	runSequence(
		['assets-get'],
		['clean:images'],
		['images'],
	callback)
})

/**
 * develop
 * -------------
 */
gulp.task('default', function(callback) {
	runSequence(
		['clean:css-styles', 'clean:css-font', 'clean:js-scripts', 'clean:js-vender'],
		['merge:css-rev', 'merge:js-rev'],
		['rev-collector'],
		['watch'],
	callback)
})


/**
 * build
 * -------------
 */
gulp.task('build', function(callback) {
	runSequence(
		['help'],
		['assets-get'],
		['clean:css-styles', 'clean:css-font', 'clean:js-scripts', 'clean:js-vender'],
		['merge:css-rev', 'merge:js-rev'],
		['rev-collector'],
		['min-html'],		
	callback)
})

/**
 * temp
 * -------------
 */
gulp.task('temp:js', function(callback) {
	runSequence(
		['clean:js-scripts', 'clean:js-vender'],
		['merge:js-rev'],
	callback)
})
gulp.task('temp:css', function(callback) {
	runSequence(
		['clean:css-styles', 'clean:css-font'],
		['merge:css-rev'],
	callback)
})
gulp.task('temp', function(callback) {
	runSequence(
		['temp:css', 'temp:js'],
		['rev-collector'],
	callback)
})

/**
 * help
 * ---------
 */
var help =
 ` **********************************************************
 *                                                        *
 *      help                                              *
 *      --------------------------------------------      *
 *      初始化：资源部署，图片优化 -> gulp init           *
 *      开发    -> gulp                                   *
 *      打包    -> gulp build                             *
 *                                                        *
 **********************************************************`
gulp.task('help', function() {
	console.log(help)
})