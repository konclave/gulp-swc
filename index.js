const swc = require('@swc/core');
const path = require('path');
const replaceExt = require('replace-ext');
const PluginError = require('plugin-error');
const applySourceMap = require('vinyl-sourcemaps-apply');
const { Transform } = require('stream');

function replaceExtension(fp) {
  return path.extname(fp) ? replaceExt(fp, '.js') : fp;
}

module.exports = function (opts) {
  opts = opts || {};

  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new PluginError('gulp-swc', 'Streaming not supported'));
        return;
      }

      const fileOpts = Object.assign({}, opts, {
        filename: file.path,
        sourceMaps: Boolean(file.sourceMap),
        caller: Object.assign({ name: 'gulp-swc' }, opts.caller),
      });

      swc
        .transform(file.contents.toString(), fileOpts)
        .then((res) => {
          if (res) {
            if (file.sourceMap && res.map) {
              const sourcemaps = JSON.parse(res.map);
              sourcemaps.file = replaceExtension(file.relative);
              sourcemaps.sources = sourcemaps.sources.map((filePath) => {
                return file.path === filePath
                  ? replaceExtension(file.relative)
                  : replaceExtension(path.relative(file.path, filePath));
              });
              applySourceMap(file, sourcemaps);
            }

            file.contents = Buffer.from(res.code);
            file.path = replaceExtension(file.path);
          }

          this.push(file);
        })
        .catch((error) => {
          this.emit(
            'error',
            new PluginError('gulp-swc', error, {
              fileName: file.path,
              showProperties: false,
            })
          );
        })
        .then(
          () => cb(),
          () => cb()
        );
    },
  });
};
