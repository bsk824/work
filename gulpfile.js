const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const scss = require('gulp-sass');
const postcss = require('gulp-postcss');
const pxtorem = require('postcss-pxtorem');
const sourcemaps = require('gulp-sourcemaps');
const dgbl = require('del-gulpsass-blank-lines');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

const path = {
	dest: './resource/',
	src: './src/',
}
const manageEnvironment = (environment) => {
	environment.addFilter('tabIndent', (str, numOfIndents, firstLine) => {
		str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
		if (!firstLine) {
			str = str.replace(/^\s+/, "");
		}
		return str;
	});
};
gulp.task('guide', () => {
	return gulp.src('./guide/src/*.html')
		.pipe(nunjucksRender({
			envOptions: {
				autoescape: false
			},
			manageEnv: manageEnvironment,
			path: ['./guide/list','./guide/src']
		}))
		.pipe(gulp.dest('./guide/'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('html', () => {
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

const cssName = 'style.css'
const scssOptions = {
	outputStyle: 'expanded', /* nested, expanded, compact, compressed */
	indentType: 'tab',
	indentWidth: 1,
	souceComments: true
}
const plugins = [
	pxtorem({
		rootValue: '10',
		propList: ['*'],
		unitPrecision: 2,
		mediaQueries: false
	})
];
gulp.task('scss', () => {
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
gulp.task('scss:pd', () => {
	return gulp
		.src(path.src + 'scss/**/*.scss')
		.pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(dgbl())
		.pipe(rename(cssName))
		.pipe(gulp.dest(path.dest + 'css'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('scss:mo', () => {
	return gulp
		.src(pathCommon.src + '/mo/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(dgbl())
		.pipe(rename('style.css'))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(pathCommon.dest + 'mo/css'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
	return gulp
		.src(path.src + 'js/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
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
	gulp.watch('./guide/list/*.html', gulp.series('guide'));
	gulp.watch(path.src + '**/*.html', gulp.series('html'));
	gulp.watch(path.src + '**/*.scss', gulp.series('scss'));
	gulp.watch(path.src + '**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('guide','html','scss','js','watch','browserSync'));

gulp.task('build', gulp.parallel('guide','html','scss:pd','js'));