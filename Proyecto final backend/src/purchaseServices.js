const Cart = require('../models/cart');
const Product = require('../models/product');
const TicketService = require('./ticketService');
const Purchase = require('./purchaseModel');

async function finalizePurchase(cartId) {
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    for (const item of cart.products) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Producto no encontrado: ${item.product}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.title}`);
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const purchaseResult = await TicketService.generatePurchaseTicket(cart);

    cart.products = cart.products.filter((item) => !item.purchased);
    await cart.save();

    return purchaseResult;
  } catch (error) {
    throw error;
  }
}

async function createPurchase(userId, cartId) {
  try {
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart || cart.userId.toString() !== userId) {
      throw new Error('Carrito no encontrado o no pertenece al usuario');
    }

    let total = 0;
    const purchaseItems = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock < quantity) {
        throw new Error(`Stock insuficiente para ${product.title}`);
      }

      product.stock -= quantity;
      await product.save();

      purchaseItems.push({
        product: product._id,
        quantity,
        price: product.price,
      });

      total += product.price * quantity;
    }

    const purchase = new Purchase({
      userId,
      cartId,
      purchaseDate: new Date(),
      total,
      items: purchaseItems,
    });

    await purchase.save();

    cart.products = [];
    await cart.save();

    return purchase;
  } catch (error) {
    throw error;
  }
}

async function verifyStock(cartItems) {
  try {
    const stockErrors = [];

    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        stockErrors.push(`Producto no encontrado para ${cartItem.product}`);
      } else if (product.stock < cartItem.quantity) {
        stockErrors.push(`Stock insuficiente para ${product.title}`);
      }
    }

    if (stockErrors.length > 0) {
      return { success: false, errors: stockErrors };
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPurchase,
  verifyStock,
  finalizePurchase,
};
