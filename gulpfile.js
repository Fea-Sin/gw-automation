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
var webserver = require('gulp-webserver')
var connect = require('gulp-connect')
var os = require('os')
var open = require('gulp-open')

var cssProcess = [
	autoprefixer({ browsers: ['last 200 versions'], cascade: false })
]

var browser = os.platform() === 'linux' ? 'google-chrome' : (
		os.platform() === 'darwin' ? 'google chrome' : (
		os.platform() === 'win32' ? 'chrome' : 'firefox'))


/*================= clean =====================*/

/**
 * clean:css-styles
 * ------------------
 */
gulp.task('clean:css-styles', function() {
	return del(['build/css/*.*'])
})

/**
 * clean:css-font
 * ----------------
 */
gulp.task('clean:css-font', function() {
	return del(['build/css/font/*.css'])
})

/**
 * clean:js-scripts
 * --------------------
 */
gulp.task('clean:js-scripts', function() {
	return del(['build/js/*.*'])
})

/**
 * clean:js-vender
 * --------------------
 */
gulp.task('clean:js-vender', function() {
	return del(['build/js/vender/*.js'])
})

/**
 * clean-images
 * ------------------
 */
gulp.task('clean:images', function() {
	return del(['build/images'])
})



/*================= assets get =====================*/

/**
 * assets favicon
 * ----------------
 */
gulp.task('assets-favicon', function() {
	return gulp.src('favicon.ico')
	           .pipe( gulp.dest('build') )
	           .pipe(notify({ message: 'assets favicon ok' }))
})

/**
 * assets:build-font
 * -------------------
 */
gulp.task('assets:build-font', function() {
	return gulp.src('src/css/font/**/*')
						 .pipe( gulp.dest('build/css/font') )
						 .pipe(notify({ message: 'assets build font ok' }))
})

/**
 * assets:dist-font
 * ---------------------
 */
gulp.task('assets:dist-font', function() {
	return gulp.src('src/css/font/**/*')
	           .pipe( gulp.dest('dist/css/font') )
	           .pipe(notify({ message: 'assets dist font ok' }))
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
 * assets dist images
 * -----------------------
 */
gulp.task('assets-images', function() {
	return gulp.src('src/images/*')
	           .pipe( gulp.dest('dist/images') )
})

/**
 * assets dist html
 * ---------------------
 */
gulp.task('assets-html', function() {
	return gulp.src(['./**/*.html', '!node_modules/**/*', '!dist/**/*', '!build/**/*'])
					   .pipe( gulp.dest('dist') )
})

/**
 * assets dist get
 * -------------------
 */
gulp.task('assets:dist-get', function(callback) {
	runSequence(	
		['assets-images'],
		['assets:dist-font'],
		['assets-html'],
	callback)
})

/**
 * assets build get
 * ------------------
 */
gulp.task('assets:build-get', function(callback) {
	runSequence(
		['assets-favicon'],
		['assets:build-font'],
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
	           .pipe( gulp.dest('build/images') )
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
						 .pipe( gulp.dest('build/css') )
						 .pipe(minifycss())
						 .pipe(rename({ suffix: '.min' }))
						 .pipe( gulp.dest('dist/css') )
						 .pipe( gulp.dest('build/css') )
						 .pipe(connect.reload())
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
	           .pipe( gulp.dest('build/css/font') )
	           .pipe(connect.reload())
	           .pipe(notify({ message: 'css font ok' }))	
})

/**
 * css-rev
 * ---------
 */
gulp.task('css-rev', function() {
	return gulp.src(['build/css/**/*.min.css'])
						 .pipe(rev())
						 .pipe( gulp.dest('build/css') )
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
					   .pipe( gulp.dest('build/js/vender') )
					   .pipe(uglify())
					   .pipe(rename({ suffix: '.min' }))
					   .pipe( gulp.dest('dist/js/vender') )
					   .pipe( gulp.dest('build/js/vender') )
					   .pipe(connect.reload())
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
						 .pipe( gulp.dest('build/js') )
						 .pipe(uglify())
						 .pipe(rename({ suffix: '.min' }))
						 .pipe( gulp.dest('dist/js') )
						 .pipe( gulp.dest('build/js') )
						 .pipe(connect.reload())
						 .pipe(notify({ message: 'js scripts ok' }))	
})

/**
 * js-rev
 * ---------
 */
gulp.task('js-rev', function() {
	return gulp.src(['build/js/**/*.min.js'])
				     .pipe(rev())
				     .pipe( gulp.dest('build/js') )
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
	return gulp.src(['rev/**/*.json', './**/*.html', '!node_modules/**/*', '!dist/**/*', '!build/**/*'])
						 .pipe(revCollector({
						 		replaceReved: true,
						 		dirReplacements: {
						 			'./css'          : './css',
						 			'./css/font'     : './css/font',
						 			'../css'         : '../css',
						 			'../css/font'    : '../css/font',
						 			'../../css'      : '../../css',
						 			'../../css/font' : '../../css/font',
						 			'./js'           : './js',
						 			'./js/vender'    : './js/vender',
						 			'../js'          : '../js',
						 			'../js/vender'   : '../js/vender',
						 			'../../js'       : '../../js',
						 			'../../js/vender': '../../js/vender',
						 			'./images'       : './images',
						 			'../images'      : '../images',
						 			'../../images'   : '../../images',			 			
						 		}
						 }))
						 .pipe( gulp.dest('build') )
						 .pipe(notify({ message: 'rev collector html ok' }))	
})

/**
 * rev-images:css
 * ---------------------
 */
gulp.task('rev-images:css', function() {
	return gulp.src(['rev/images/*.json', 'build/css/*.css'])
						 .pipe(revCollector({
						 		replaceReved: true
						 }))
						 .pipe( gulp.dest('build/css') )
						 .pipe(notify({ message: 'rev images css ok' }))
})


/**
 * rev-images:js
 * -------------------------
 */
gulp.task('rev-images:js', function() {
	return gulp.src(['rev/images/*.json', 'build/js/*.js'])
						 .pipe(revCollector({
						 		replaceReved: true,
						 		dirReplacements: {
						 			'./images'    : './images',
						 			'../images'   : '../images',
						 			'../../images': '../../images',
						 		}						 		
						 }))
						 .pipe( gulp.dest('build/js') )
						 .pipe(notify({ message: 'rev images js build ok ' }))	
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



/*================= webserver =================*/

/**
 * dist webserver
 * ------------------
 */
/*gulp.task('webserver:dist', function() {
	gulp.src('.')
	    .pipe(webserver({
	    	port: 3001,
	    	path: '/build',
	    	livereload: true,
	    	directoryListing: true,
	    	open: true,
	    	fallback: 'index.html',
	    }))
})
*/

/**
 * connect dist
 * ----------------
 */
gulp.task('connect:dist', function() {
	return connect.server({
		name: 'develop',
		root: 'dist/',
		port: 3001,
		livereload: true,
		fallback: 'index.html',
	})
})

/**
 * connect build
 * ----------------
 */
gulp.task('connect:build', function() {
	return connect.server({
		name: 'build',
		root: 'build/',
		port: 3000,
		fallback: 'index.html'
	})
})

/**
 * browser dist
 * ----------------
 */
gulp.task('browser-dist', function() {
	var options = {
		uri: 'http://localhost:3001',
		app: browser,
	}

	return gulp.src(__filename)
	    .pipe(open(options))
})

/**
 * browser build
 * ----------------
 */
gulp.task('browser-build', function() {
	var options = {
		uri: 'http://localhost:3000',
		app: browser,
	}

	return gulp.src(__filename)
	           .pipe(open(options))
})

/**
 * webserver-dist
 * -------------------
 */
gulp.task('webserver-dist', function(callback) {
	runSequence(
		['connect:dist'],
		['browser-dist'],
	callback)
})

/**
 * webserver-build
 * -----------------
 */
gulp.task('webserver-build', function(callback) {
	runSequence(
		['connect:build'],
		['browser-build'],
	callback)
})

/**
 * reload-html
 * ----------------
 */
gulp.task('reload-html', function() {
	return gulp.src('dist/**/*.html')
	           .pipe(connect.reload())
})

/**
 * connect-reload
 * -------------------
 */
gulp.task('connect-reload', function() {
	return gulp.src(__filename)
	           .pipe(connect.reload())
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
	gulp.watch('src/images/*', ['watch:images'])
	gulp.watch('index.html', ['watch:html'])
	gulp.watch('partial/**/*.html', ['watch:html'])
})

/**
 * watch:css-font
 * -------------------
 */
gulp.task('watch:css-font', function(callback) {
	runSequence(
		['css:font'],
	callback)
})

/**
 * watch:css-styles
 * -------------------
 */
gulp.task('watch:css-styles', function(callback) {
	runSequence(
		['css:styles'],
	callback)
})

/**
 * watch:js-vender
 * -------------------
 */
gulp.task('watch:js-vender', function(callback) {
	runSequence(
		['js:vender'],	
	callback)
})

/**
 * watch:js-scripts
 * -------------------
 */
gulp.task('watch:js-scripts', function(callback) {
	runSequence(
		['js:scripts'],
	callback)
})

/**
 * watch:images
 * ----------------
 */
gulp.task('watch-images', function(callback) {
	runSequence(
		['assets-images'],
	callback)
})

/**
 * watch:html
 * -----------------
 */
gulp.task('watch:html', function(callback) {
	runSequence(
		['assets-html'],
		['reload-html'],
	callback)
})



/*================= process =====================*/

/**
 * mini html
 * -----------
 */
gulp.task('min-html', function() {
	return gulp.src('build/**/*.html')
			       .pipe(htmlmin({ collapseWhitespace: true }))
			       .pipe( gulp.dest('build') )
			       .pipe(notify({ message: 'mini html ok' }))
})

/**
 * init
 * -------------
 */
gulp.task('init', function(callback) {
	runSequence(
		['assets:dist-get'],
		['assets:build-get'],
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
		['assets-html'],
		['css:styles', 'css:font', 'js:vender', 'js:scripts'],
		['webserver-dist'],
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
		['assets:build-get'],
		['clean:css-styles', 'clean:css-font', 'clean:js-scripts', 'clean:js-vender'],
		['merge:css-rev', 'merge:js-rev'],
		['rev-collector'],
		['min-html'],
		['webserver-build'],		
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