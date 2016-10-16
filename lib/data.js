const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: process.env.SHOP_DOMAIN,
  apiKey: process.env.SHOP_API_KEY,
  password: process.env.SHOP_PASSWORD
});

const data = {
  shop: {},
  collections: {}
};

module.exports = function fetchData() {
  return Promise.all([
    fetchShopData(),
    fetchAllCollections().then((collections) => {
      return Promise.all(collections.map(fetchProductsForCollection))
    })
  ]).then(() => data);
}

function fetchShopData() {
  return shopify.shop.get()
    .then((shop) => {
      data.shop = shop;
      return shop;
    });
}

function fetchAllCollections() {
  return shopify.customCollection.list();
}

function fetchProductsForCollection(collection) {
  return shopify.product.list({collection_handle: collection.handle})
    .then((products) => {
      const stubbedProducts = products.map(addStubsToProduct);
      const collectionWithProducts = _.assign({}, collection, {
        products: stubbedProducts
      });
      data.collections[collection.handle] = collectionWithProducts;
      return collectionWithProducts;
    });
}

function addStubsToProduct(product) {
  let returnProduct = _.assign({}, product);

  Object.defineProperty(returnProduct, 'selected_or_first_available_variant', {
    get: function() {
      return this.variants[0];
    },
    enumerable: true
  })

  Object.defineProperty(returnProduct, 'featured_image', {
    get: function() {
      if(this.image)
        return this.image.src;
      else
        return '';
    },
    enumerable: true
  })
  return returnProduct;
}
