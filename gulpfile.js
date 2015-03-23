/*global -$ */
'use strict';
// generated on 2015-03-22 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fileinclude = require('gulp-file-include');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
    return gulp.src([
        'app/assets/js/jquery-1.11.1.min.js',
        'app/assets/bootstrap/js/bootstrap.min.js',
        'app/assets/js/bootstrap-hover-dropdown.min.js',
        'app/assets/js/jquery.backstretch.min.js',
        'app/assets/js/wow.min.js',
        'app/assets/js/retina-1.1.0.min.js',
        'app/assets/js/jquery.magnific-popup.min.js',
        'app/assets/twitter/jquery.tweet.min.js',
        'app/assets/js/scripts.js'
        ])
        .pipe(concat('myscripts.js'))
        .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('combineStyles', function() {
    return gulp.src([
        'http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic',
        'http://fonts.googleapis.com/css?family=Roboto:400,300,100,100italic,300italic,400italic,700,700italic',
        'app/assets/bootstrap/css/bootstrap.min.css',
        'app/assets/font-awesome/css/font-awesome.min.css',
        'app/assets/css/animate.css',
        'app/assets/css/magnific-popup.css',
        'app/assets/ultimate-flat-social-icons/ultm-css/ultm.css',
        'app/assets/css/form-elements.css',
        'app/assets/css/buttons.css',
        'app/assets/css/style.css',
        'app/assets/css/media-queries.css'
    ])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['combineStyles','scripts'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('fileinclude', function() {
    gulp.src('app/templates/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('images', function () {
  return gulp.src('app/assets/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*').concat('app/assets/font-awesome/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('extras2', function () {
    return gulp.src([
        'app/assets/ultimate-flat-social-icons/**/*'
    ], {
        dot: true
    }).pipe(gulp.dest('dist/assets/'));
});




gulp.task('clean', require('del').bind(null, ['.tmp/**/*', 'dist/**/*']));

gulp.task('sites',function(){
    gulp.src(['dist/**/*']).pipe(gulp.dest('/Users/ningsuhen/Sites/newphonebook'));
});

gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/templates/*.html', ['fileinclude']);

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);


  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['jshint', 'fileinclude','html', 'images', 'fonts', 'extras','extras2'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
