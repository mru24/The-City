var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleancss = require('gulp-cleancss'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    seo = require('gulp-seo'),
    htmlReplace = require('gulp-html-replace'),
    htmlMin = require('gulp-htmlmin'),
    sitemap = require('gulp-sitemap'),
    copy = require('gulp-copy'),
    del = require('del'),
    sequence = require('run-sequence'),
    browserSync = require('browser-sync');

var config = {
  src: 'src/',
  dest: 'dist/',
  htmlin: 'src/*.html',
  sitemapsrc: 'src/**/*.html',
  sassin: 'src/sass/**/*.sass',
  sassout: 'src/css/',
  cssin: 'src/css/**/*.css',
  cssout: 'dist/css',
  jsin: 'src/js/**/*.js',
  jsout: 'dist/js/',
  imgin: 'src/img/**/*',
  imgout: 'dist/img/'
}

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('server', ['sass'], function() {
  browserSync.init({
    server: config.src
  })
  gulp.watch(config.htmlin, ['reload']);
  gulp.watch(config.sassin, ['sass']);
  gulp.watch(config.jsin, ['js-watch']);
});

gulp.task('js', function() {
  return gulp.src(config.jsin)
});

gulp.task('js-watch', ['js'], function() {
  browserSync.reload();
});

gulp.task('sass', function() {
  return gulp
    .src(config.sassin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.sassout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp
    .src(config.cssin)
    .pipe(concat('style.css'))
    .pipe(cleancss())
    .pipe(gulp.dest(config.cssout))
});

gulp.task('js', function(callback) {
  pump([
        gulp.src(config.jsin),
        uglify(),
        concat('main.js'),
        gulp.dest(config.jsout)
      ],
    callback
  );
});

gulp.task('image', function() {
  gulp
    .src(config.imgin)
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout))
});

gulp.task('html', function() {
  return gulp
    .src(config.htmlin)
    .pipe(htmlReplace({
      'css': 'css/style.css',
      'js': 'js/main.js'
    }))
    .pipe(seo({
      list: ['og', 'se', 'schema', 'twitter'],
      meta: {
            title: 'POLAND - Road to World Cup 2018',
            description: 'The way of Polish Football team to World Cup 2018 finals',
            author: 'Val Wroblewski',
            keywords: ['Poland', 'World', 'Cup', '2018', 'football', 'qualifications', 'Russia'],
            robots: {
                index: false, // true
                follow: true // true
            },
            revisitAfter: '5 month', // 3 month
            // image: 'http://mywebsite.com/image.jpg',
            site_name: 'wwproject.eu',
            type: 'website'
        }
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dest))
});

gulp.task('copy', function() {
  return gulp
    .src(config.src)
    .pipe(gulp.dest(config.dest))
});

gulp.task('sitemap', function() {
  gulp
    .src(config.sitemapsrc, {
      read: false
    })
    .pipe(sitemap({
      siteUrl: 'http://www.wwproject.eu/projects/RTWC'
    }))
    .pipe(gulp.dest(config.dest))
});

gulp.task('clean', function() {
  return del([config.dest])
});

gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css', 'images', 'sitemap']);
});

gulp.task('default', ['server']);


// Use GULP BUILD to create built version
// abg GULP to start Server
