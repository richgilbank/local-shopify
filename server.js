const fs = require('fs');
const express = require('express');
const settings_data = require('./theme/config/settings_data.json');
const Liquid = require('liquid-node');

const app = express();
const engine = new Liquid.Engine();
app.set('port', process.env.PORT || 3000);
engine.registerFileSystem(new Liquid.LocalFileSystem('./theme/snippets', 'liquid'));

const templateSettings = {settings: settings_data.current};
const indexPath = './theme/templates/index.liquid';

app.get('/', (req, res) => {
  res.send('home');
});

// Start the server, auto reload
app.listen(app.get('port'), () => {
  console.log('Listening on port 3000');
});
