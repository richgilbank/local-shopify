const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const localesDir = path.join(process.cwd(), 'theme', 'locales');
const localePath = path.join(localesDir, 'en.default.json');

module.exports = function registerFilters(liquid) {

  liquid.registerFilter('product_img_url', (v, arg) => {
    return v;
  });

  fs.readFile(localePath, 'utf8', (err, contents) => {
    const localeObj = recursivelyCompileLiquid(JSON.parse(contents));

    liquid.registerFilter('t', (v, arg) => {
      if(!_.has(localeObj, v)) throw new Error('Language setting does not exist: ', v);
      return _.get(localeObj, v);
    });
  });

  function recursivelyCompileLiquid(obj) {
    let localeStrings = {};
    for(key in obj) {
      if(typeof obj[key] == 'object') {
        localeStrings[key] = recursivelyCompileLiquid(obj[key])
      } else {
        localeStrings[key] = obj[key];
        // TODO: compile liquid
      }
    }
    return localeStrings;
  }
}
