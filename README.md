# gulp-swc

[Gulp](https://gulpjs.com/) plugin that allows to use [swc](https://swc.rs/) javascript / typescript compiler in a gulp pipeline.

## Install plugin and peer dependencies

```
npm install gulp-swc @swc/core gulp --save-dev
```
or
```
yarn add gulp-swc @swc/core gulp --dev
```

## Usage

In your gulpfile.js:

```javascript
const gulp = require('gulp');
const swc = require('gulp-swc');

// Any options to configure swc: https://swc.rs/docs/configuring-swc
const swcOptions = {
  jsc: {
    target: "es5",
  }
};

gulp.task('build', () =>
  gulp.src('./app.js')
    .pipe(swc(swcOptions))
    .pipe(gulp.dest('dist'))
);
```

### Include sourcemaps

```javascript
const gulp = require('gulp');
const swc = require('gulp-swc');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const swcOptions = {
  jsc: {
    target: "es5",
  },
  sourceMaps: true
};

gulp.task('build', () =>
  gulp.src('./app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(swc(swcOptions))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
);
```
