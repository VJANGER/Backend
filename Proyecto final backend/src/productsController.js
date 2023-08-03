import ProductModel from '../models/productModel.js';

export const addProduct = async (req, res) => {
  try {
    const product = req.body;

    // Validaciones del producto
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    // Crear nuevo producto en la base de datos
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
  