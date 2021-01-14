const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const dgbl = require('del-gulpsass-blank-lines');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

const scssOptions = {
	outputStyle: 'expanded', /* nested, expanded, compact, compressed */
	indentType: 'tab',
	indentWidth: 1,
	souceComments: true
}
const cssName = 'style.css'
const path = {
	dest: './resource/',
	src: './src/',
}
gulp.task('html-tpl', () => {
	const manageEnvironment = (environment) => {
		environment.addFilter('tabIndent', (str, numOfIndents, firstLine) => {
			str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
			if (!firstLine) {
				str = str.replace(/^\s+/, "");
			}
			return str;
		});
	};

	return gulp.src(path.src + 'html/**/*.html')
		.pipe(nunjucksRender({
			envOptions: {
				autoescape: false
			},
			manageEnv: manageEnvironment,
			path: [path.src]
		}))
		.pipe(gulp.dest(path.dest + 'html'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('scss:compile', () => {
	return gulp
		.src(path.src + 'scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(dgbl())
		.pipe(rename(cssName))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.dest + 'css'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('js', () => {
	return gulp
		.src(path.src + 'js/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.dest + 'js'))
		.pipe(browserSync.reload({ stream: true }));
})
gulp.task('browserSync', () => {
	return browserSync.init({
		port: 10,
		server: {
			baseDir: './'
		}
	})
});
gulp.task('watch', () => {
	gulp.watch(path.src + '**/*.html', gulp.series('html-tpl'));
	gulp.watch(path.src + '**/*.scss', gulp.series('scss:compile'));
	gulp.watch(path.src + '**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('watch', 'browserSync', 'html-tpl', 'scss:compile'));