const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const PurchaseService = require('../services/purchaseService');

router.post('/:cid/purchase', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productsToPurchase = cart.products.filter((product) => !product.purchased);

    if (productsToPurchase.length === 0) {
      return res.status(400).json({ error: 'No products to purchase in the cart' });
    }

    const purchaseService = new PurchaseService();
    const productsNotInStock = await purchaseService.checkStock(productsToPurchase);

    if (productsNotInStock.length > 0) {
      return res.status(400).json({ error: 'Not enough stock for some products', productsNotInStock });
    }

    await purchaseService.purchaseProducts(productsToPurchase);

    productsToPurchase.forEach((product) => {
      const productInCart = cart.products.find((p) => p.product.equals(product.product));
      if (productInCart) {
        productInCart.purchased = true;
      }
    });

    await cart.save();

    return res.status(200).json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
