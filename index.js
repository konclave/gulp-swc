const swc = require("@swc/core");
const path = require("path");
const replaceExt = require("replace-ext");
const through = require("through2");
const PluginError = require("plugin-error");
const applySourceMap = require("vinyl-sourcemaps-apply");

function replaceExtension(fp) {
  return path.extname(fp) ? replaceExt(fp, ".js") : fp;
}

module.exports = function (opts) {
  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError("gulp-swc", "Streaming not supported"));
      return;
    }

    const fileOpts = Object.assign({}, opts, {
      filename: file.path,
      sourceMap: Boolean(file.sourceMap),
    });

    swc
      .transform(file.contents.toString(), fileOpts)
      .then((res) => {
        if (res) {
          if (file.sourceMap && res.map) {
            res.map.file = replaceExtension(file.relative);
            applySourceMap(file, res.map);
          }

          file.contents = Buffer.from(res.code);
          file.path = replaceExtension(file.path);
        }

        this.push(file);
      })
      .catch((error) => {
        this.emit(
          "error",
          new PluginError("gulp-swc", error, {
            fileName: file.path,
            showProperties: false,
          })
        );
      })
      .then(
        () => cb(),
        () => cb()
      );
  });
};
