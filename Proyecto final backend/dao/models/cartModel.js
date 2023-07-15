import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
