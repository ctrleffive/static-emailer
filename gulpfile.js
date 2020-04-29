const del = require('del')
const gulp = require('gulp')
const csso = require('gulp-csso')
const uglify = require('gulp-uglify-es').default
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
]

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return (
    gulp
      .src('./src/style.css')
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer({ overrideBrowserslist: AUTOPREFIXER_BROWSERS }))
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(gulp.dest('./public'))
  )
})

// Gulp task to minify JavaScript files
gulp.task('scripts', function () {
  return (
    gulp
      .src('./src/client.js')
      // Minify the file
      .pipe(uglify())
      // Output
      .pipe(gulp.dest('./public'))
  )
})

// Gulp task to minify HTML files
gulp.task('pages', function () {
  return gulp
    .src(['./src/index.html'])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest('./public'))
})

// Gulp task to copy all static files to public
gulp.task('static', function () {
  return gulp
    .src(['./src/static/*'])
    .pipe(gulp.dest('./public'))
})

// Clean output directory
gulp.task('clean', () => del(['public']))

gulp.task(
  'default',
  gulp.series('clean', gulp.parallel('styles', 'scripts', 'pages', 'static'), (done) => {
    done()
  })
)
