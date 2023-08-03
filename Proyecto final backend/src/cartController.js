import CartModel from '../models/cartModel.js';
import ProductModel from '../models/productModel.js';

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.products = cart.products.filter((product) => product.toString() !== pid);

    await cart.save();

    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.products = products;

    await cart.save();

    res.json({ status: 'success', message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const product = await ProductModel.findById(pid);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (!cart.products.includes(pid)) {
      return res.status(404).json({ status: 'error', message: 'Product not in cart' });
    }

    cart.products = cart.products.map((product) =>
      product.toString() === pid ? { _id: pid, quantity } : product
    );

    await cart.save();

    res.json({ status: 'success', message: 'Product quantity in cart updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    await cart.remove();

    res.json({ status: 'success', message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid).populate('products');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
