'use strict';

const postcss = require('postcss');
const postcssModules = require('postcss-modules');

const cssModulify = (path, data, map) => {
  let json = {};
  const getJSON = (_, _json) => json = _json;

  return postcss([postcssModules({getJSON})]).process(data, {from: path, map}).then(x => {
    const exports = 'module.exports = ' + JSON.stringify(json) + ';';
    return { data: x.css, map: x.map, exports };
  });
};

class CSSCompiler {
  constructor(cfg) {
    if (cfg == null) cfg = {};
    this.config = cfg.plugins && cfg.plugins.css || {};
  }
  compile(params) {
    if (this.config.cssModules) {
      return cssModulify(params.path, params.data, params.map);
    } else {
      return Promise.resolve(params);
    }
  }
}

CSSCompiler.prototype.brunchPlugin = true;
CSSCompiler.prototype.type = 'stylesheet';
CSSCompiler.prototype.extension = 'css';

module.exports = CSSCompiler;
