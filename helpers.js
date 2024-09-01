const path = require('path');
const SourceMapGenerator = require('source-map').SourceMapGenerator;
const SourceMapConsumer = require('source-map').SourceMapConsumer;

function startsWithSingleDot(fpath) {
  const first2chars = fpath.slice(0, 2);
  return first2chars === '.' + path.sep || first2chars === './';
}

function replace(npath, ext) {
  if (typeof npath !== 'string' || npath.length === 0) {
    return npath;
  }

  const nFileName = path.basename(npath, path.extname(npath)) + ext;
  const nFilepath = path.join(path.dirname(npath), nFileName);

  if (startsWithSingleDot(npath)) {
    return '.' + path.sep + nFilepath;
  }
  return nFilepath;
}

function replaceExtension(fp) {
	return path.extname(fp) ? replace(fp, '.js') : fp;
}

function applySourceMap(file, sourceMap) {
  if (typeof sourceMap === 'string' || sourceMap instanceof String) {
    sourceMap = JSON.parse(sourceMap);
  }

  if (file.sourceMap && (typeof file.sourceMap === 'string' || file.sourceMap instanceof String)) {
    file.sourceMap = JSON.parse(file.sourceMap);
  }

  // check source map properties
  assertProperty(sourceMap, "file");
  assertProperty(sourceMap, "mappings");
  assertProperty(sourceMap, "sources");

  // fix paths if Windows style paths
  sourceMap.file = sourceMap.file.replace(/\\/g, '/');
  sourceMap.sources = sourceMap.sources.map(function(filePath) {
    return filePath.replace(/\\/g, '/');
  });

  if (file.sourceMap && file.sourceMap.mappings !== '') {
    const generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(sourceMap));
    generator.applySourceMap(new SourceMapConsumer(file.sourceMap));
    file.sourceMap = JSON.parse(generator.toString());
  } else {
    file.sourceMap = sourceMap;
  }
};


function assertProperty(sourceMap, propertyName) {
  if (!sourceMap.hasOwnProperty(propertyName)) {
    const e = new Error('Source map to be applied is missing the \"' + propertyName + '\" property');
    throw e;
  }
}


module.exports = {
	replaceExtension,
	applySourceMap
}