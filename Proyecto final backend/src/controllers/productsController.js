import ProductModel from '../models/productModel.js';
const nodemailer = require('nodemailer');

export const addProduct = async (req, res) => {
  try {
    const product = req.body;

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const newProduct = await ProductModel.create(product);

    res.json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
  
      const skip = (page - 1) * limit;
      const filter = {};
  
      if (query) {
        filter.$or = [
          { category: query },
          { availability: query.toLowerCase() === 'true' },
        ];
      }
  
      const totalProducts = await ProductModel.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
  
      const products = await ProductModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort === 'desc' ? { price: -1 } : { price: 1 });
  
      res.json({
        status: 'success',
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  const productDao = require('../dao/productDao');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productDao.getAllProducts();
    res.render('productView', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

const Product = require('../models/productModel');

exports.createProduct = async (req, res) => {
  try {
    const currentUser = req.user;

    const newProduct = new Product({
      owner: currentUser._id, 
    });

    await newProduct.save();

    res.status(201).json({ message: 'Producto creado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.equals(userId))) {
      await product.remove();
      return res.json({ message: 'Producto eliminado con éxito.' });
    } else {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este producto.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

const ProductModel = require('../models/productModel');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'tuCorreo@gmail.com',
          pass: 'tuContraseña',
      },
  });

  const mailOptions = {
      from: 'tuCorreo@gmail.com',
      to,
      subject,
      text,
  };

  await transporter.sendMail(mailOptions);
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await ProductModel.findById(productId);

        if (product.owner && req.user.role === 'premium') {
          const ownerEmail = 'correoDelPropietario@ejemplo.com';
          const emailSubject = 'Producto Eliminado';
          const emailText = `Estimado usuario premium, tu producto "${product.title}" ha sido eliminado.`;

          await sendEmail(ownerEmail, emailSubject, emailText);        }

        await ProductModel.findByIdAndRemove(productId);
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting product');
    }
};

