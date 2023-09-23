const Product = require('../models/Product');

exports.getAllProducts = async () => {
  return Product.find();
};
