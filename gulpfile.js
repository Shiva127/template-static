import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import connect from 'gulp-connect'
import getPort, { portNumbers } from 'get-port'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import rename from 'gulp-rename'
import rimraf from 'rimraf'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'

function clean (done) {
  rimraf('build/', done)
}

function views () {
  return gulp.src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('build'))
    .pipe(connect.reload())
}

function styles () {
  return gulp.src('src/sass/styles.sass', { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpSass(sass)({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'],
      cascade: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(connect.reload())
}

function scripts () {
  return gulp.src('src/js/scripts.js', { allowEmpty: true })
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
    port: await getPort({ port: portNumbers(8080, 8099) })
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

export default watch
export { build }
