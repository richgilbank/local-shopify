const path = require('path');
const fs = require('fs');
const express = require('express');
const settings_data = require('./theme/config/settings_data.json');
const Liquid = require('shopify-liquid');
const engine = Liquid({
  root: path.resolve(__dirname, 'theme/'),
  extname: '.liquid',
  cache: false
});

const settingsData = require('./theme/config/settings_data.json');
const collectionsData = {
  frontpage: {
    products: [
      1,2,3
    ]
  }
};
const pagesData = {
  frontpage: {
    content: 'foobar'
  }
};
const objects = {
  page_title: 'my page',
  current_page: 1,
  template: 'index',
  shop: {
    name: 'My Shop'
  }
};
const renderSettings = Object.assign({}, objects, {
  settings: settingsData.current,
  collections: collectionsData,
  pages: pagesData
});

const app = express();
app.use(express.static('theme'));
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  engine.renderFile('templates/index', renderSettings)
    .then(function(html) {
      res.send(html);
    })
    .catch(function(liquidErr) {
      console.log(liquidErr);
    });
});

// Start the server, auto reload
app.listen(app.get('port'), () => {
  console.log('Listening on port 3000');
});
