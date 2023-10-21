/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: El título del producto.
 *         category:
 *           type: string
 *           description: La categoría a la que pertenece el producto.
 *         image:
 *           type: string
 *           description: La URL de la imagen del producto.
 *         price:
 *           type: number
 *           description: El precio del producto.
 *         stock:
 *           type: number
 *           description: La cantidad en stock del producto.
 *         owner:
 *           type: string
 *           description: El ID del usuario propietario del producto.
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {type: String,required: true,},
  category: {type: String,required: true,},
  image: {type: String,required: true,},
  price: {type: Number,required: true,},
  stock: {type: Number,required: true,},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
