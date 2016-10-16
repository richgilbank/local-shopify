const fs = require('fs');
const path = require('path');
const watch = require('watch');
const sass = require('node-sass');
const Liquid = require('shopify-liquid');
const engine = Liquid();

const assetsDir = path.join(process.cwd(), 'theme', 'assets');
const settings = require(path.resolve(process.cwd(), 'theme/config/settings_data.json'));

const isLiquidFile = /\.liquid$/;
const isLiquidSCSS = new RegExp(`\.scss${isLiquidFile.source}`);

fs.readdir(assetsDir, (err, files) => {
  files
    .filter((file) => isLiquidFile.test(file))
    .forEach(compileLiquid);
});

watch.createMonitor(assetsDir, {
    filter: (file) => isLiquidFile.test(file)
  }, (monitor) => {
  monitor.on('changed', (filename) => {
    compileLiquid(filename);
  });
});

function compileLiquid(filename) {
  const liquidFilePath = path.join(assetsDir, filename);
  fs.readFile(liquidFilePath, 'utf8', function(err, liquid) {
    engine.parseAndRender(liquid, {settings: settings.current})
      .then(function(contents) {
        const newFilePath = filename.replace(/\.liquid$/, '');
        const writeFunction = isLiquidSCSS.test(filename) ? writeCompiledLiquidSCSS : writeCompiledLiquid;
        writeFunction(newFilePath, contents);
      }).catch(function(err) {
        throw err;
      });
  });
}

function writeCompiledLiquidSCSS(filename, contents) {
  const filePath = path.join(assetsDir, filename);
  const filePathWithCSS = `${filePath}.css`;
  fs.writeFile(filePath, contents, (err) => {
    if(err) throw err;
      sass.render({
        data: contents,
      }, (err, result) => {
        if(err) throw err;
        fs.writeFile(filePathWithCSS, result.css.toString(), (err) => {
          if(err) throw err;
        });
      });
  });
}

function writeCompiledLiquid(filename, contents) {
  const filePath = path.join(assetsDir, filename);
  fs.writeFile(filePath, contents, (err) => {
    if(err) throw err;
  });
}
