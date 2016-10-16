const fs = require('fs');
const path = require('path');
const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: process.env.SHOP_DOMAIN,
  apiKey: process.env.SHOP_API_KEY,
  password: process.env.SHOP_PASSWORD
});

const data = {};

module.exports = function fetchData() {
  return new Promise((resolve, reject) => {
    shopify.customCollection.list()
      .then((collections) => {
        data['collections'] = {};
        collections.forEach((collection) => {
          data.collections[collection.handle] = collection;
        });
        return collections;
      })
      .then((collections) => {
        const collectionPromises = collections.map((collection) => {
          return shopify.product.list({collection_handle: collection.handle})
            .then((products) => {
              collection.products = products;
              data.collections[collection.handle] = collection;
              return data;
          });
        });
        Promise.all(collectionPromises).then(() => resolve(data));
      });
  });
}
