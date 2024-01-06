// vite.config.js
const { resolve } = require("path");
const { defineConfig } = require("vite");
module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cart: resolve(__dirname, "cart.html"),
        checkout: resolve(__dirname, "checkout.html"),
        products: resolve(__dirname, "products.html"),
        productDetail: resolve(__dirname, "product-detail.html"),
      },
    },
  },
});
