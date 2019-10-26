let autoprefixer = require('gulp-autoprefixer')
let babel = require('gulp-babel')
let connect = require('gulp-connect')
let getPort = require('get-port')
let gulp = require('gulp')
let plumber = require('gulp-plumber')
let pug = require('gulp-pug')
let rename = require('gulp-rename')
let rimraf = require('rimraf')
let sass = require('gulp-sass')
let uglify = require('gulp-uglify')

function clean (done) {
  rimraf('build/*', done)
}

function views () {
  return gulp.src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('build'))
    .pipe(connect.reload())
}

function styles () {
  return gulp.src('src/sass/styles.sass')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'],
      cascade: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css'))
    .pipe(connect.reload())
}

function scripts () {
  return gulp.src('src/js/scripts.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js'))
    .pipe(connect.reload())
}

async function server (done) {
  connect.server({
    root: 'build',
    livereload: true,
    port: await getPort({
      host: 'localhost',
      port: getPort.makeRange(8080, 8099)
    })
  })
  done()
}

function assets () {
  return gulp.src('src/assets/**/*', { dot: true })
    .pipe(gulp.dest('build'))
}

function watches (done) {
  gulp.watch('src/pug/**/*.pug', views)
  gulp.watch('src/sass/**/*.sass', styles)
  gulp.watch('src/js/**/*.js', scripts)
  gulp.watch('src/assets/**/*', assets)
  done()
}

let build = gulp.series(clean, gulp.parallel(views, styles, assets, scripts))
let watch = gulp.series(build, gulp.parallel(watches, server))

exports.default = watch
exports.build = build
