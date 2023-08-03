import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
