# gulp-swc

[Gulp](https://gulpjs.com/) plugin that allows to use [swc](https://swc.rs/) javascript / typescript compiler in a gulp pipeline.

## Install

```
npm install gulp-swc --save-dev
```
or
```
yarn add gulp-swc --dev
```

## Usage

In your gulpfile.js:

```
const gulp = require('gulp');
const swc = require('gulp-swc');

const swcOptions = {}; // Any options to configure swc: https://swc.rs/docs/configuring-swc

gulp.task('build', () =>
	gulp.src('./app.js')
		.pipe(swc(swcOptions))
		.pipe(gulp.dest('dist'));
);
```
