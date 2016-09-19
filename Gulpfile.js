'use strict';
var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  nib = require('nib'),
  concat = require('gulp-concat'),
  stylus = require('gulp-stylus'),
  Filter = require('gulp-filter'),
  minifyCss = require('gulp-minify-css'),
  uncss = require('gulp-uncss'),
  inject = require('gulp-inject'),
  angularFilesort = require('gulp-angular-filesort'),
  uglify = require('gulp-uglify'),
  wiredep = require('wiredep').stream,
  sass = require('gulp-sass'),
  templateCache = require('gulp-angular-templatecache'),
  runSequence = require('run-sequence'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  proxy = require('http-proxy-middleware');


var dir = {
  dev: {
    path: 'app',
    devcss: 'app/assets/css/**/*.css',
    js: 'app/assets/js/**/*.js',
    jsDir: 'app/assets/js',
    stylus: 'app/assets/stylus/**/*.styl',
    scss: 'app/assets/sass/**/*.scss',
    i18nDir: 'app/i18n',
    imgDir: 'app/img',
    fontsDir: 'app/fonts',
    sassOpts: {
      outputStyle: 'compressed',
      precison: 3,
      errLogToConsole: true
    },
    templates: 'app/templates/**/*.html'
  },
  dist: {
    path: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    img: 'dist/img',
    fonts: 'dist/fonts',
    i18n: 'dist/i18n'
  },
  bowersrc: 'app/bower_components'

};
dir.styles = [];
dir.styles.push(dir.dev.devcss);
dir.styles.push(dir.dev.stylus);
dir.styles.push(dir.dev.scss);

gulp.task('server-dev', function() {
  connect.server({
    root: dir.dev.path,
    livereload: true,
    port: 18080,
    middleware: function(connect, opt) {
      return [
        proxy('/core', {
          target: 'http://localhost:38080/grcore/rest/',
          changeOrigin: false,
          pathRewrite: {
            '^/core': '/'
          }
        })
      ];
    }

  });
});

gulp.task('server-dist', function() {
  connect.server({
    root: dir.dist.path,
    livereload: true,
    port: 18081,
    middleware: function(connect, opt) {
      return [
        proxy('/core', {
          target: 'http://localhost:8080/GRCore/rest/',
          changeOrigin: false,
          pathRewrite: {
            '^/core': '/'
          }
        })
      ];
    }
  });
});

gulp.task('lint', function() {
  return gulp.src(dir.dev.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compilecss', function() {
  gulp.src(dir.dev.stylus)
    .pipe(stylus({
      use: nib()
    }))
    .pipe(concat('stylus.css'))
    .pipe(gulp.dest('app/css'));

  gulp.src(dir.dev.scss)
    .pipe(sass(dir.dev.sassOpts))
    .pipe(concat('sass.css'))
    .pipe(gulp.dest('app/css'));
  return;
});

gulp.task('inject', function() {
  return gulp.src('index.html', {
      cwd: './app'
    })
    .pipe(inject(
      gulp.src([dir.dev.js]) //.pipe(angularFilesort())
      , {
        ignorePath: '/app/'
      }))
    .pipe(inject(
      gulp.src([dir.dev.devcss]), {
        ignorePath: '/app/'
      }))
    .pipe(wiredep({}))
    .pipe(gulp.dest('app/'));
  return;
});

gulp.task('html', function() {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([dir.dev.stylus, dir.dev.scss], ['compilecss', 'inject', 'html']);
  gulp.watch(dir.dev.css, ['inject', 'html']);
  gulp.watch([dir.dev.js, './Gulpfile.js'], ['lint', 'inject', 'html']);
  //gulp.watch([dir.dev.templates], ['templates', 'html']);

});
gulp.task('templates', function() {
  gulp.src(dir.dev.templates)
    .pipe(templateCache({
      root: 'templates/',
      module: 'globalRemises.templates',
      standalone: true
    }))
    .pipe(uglify())
    .pipe(gulp.dest(dir.dev.jsDir));
});

gulp.task('compress', function() {
  return gulp.src(dir.dev.path + '/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify({
      mangle: false,
      preserveComments: 'all'
    })))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest(dir.dist.path));
});

gulp.task('copy', function() {
  gulp.src(dir.dev.imgDir + '/**/*')
    .pipe(gulp.dest(dir.dist.img));
  gulp.src(dir.dev.fontsDir + '/**/*')
    .pipe(gulp.dest(dir.dist.fonts));
    gulp.src(dir.dev.i18nDir + '/**/*')
    .pipe(gulp.dest(dir.dist.i18n));
});

gulp.task('default', ['lint', 'compilecss', 'inject', /*'templates',*/ 'watch', 'server-dev']);
gulp.task('build', function() {
  runSequence(['templates', 'compress', 'copy']);
});
