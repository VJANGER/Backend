import ProductModel from '../dao/models/productModel.js';

class ProductManager {
  async addProduct(productData) {
    try {
      const { title, category, image, seller } = productData;
      
      if (!title) {
        throw new Error('Title is required.');
      }

      if (!category) {
        throw new Error('Category is required.');
      }

      if (!image) {
        throw new Error('Image URL is required.');
      }

      if (!seller || !seller.name || !seller.email) {
        throw new Error('Seller information is required.');
      }

      const product = new ProductModel({
        title,
        category,
        image,
        seller,
      });

      const newProduct = await product.save();

      return newProduct._id;
    } catch (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  async getProducts(limit) {
    try {
      let query = ProductModel.find();

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const products = await query.exec();

      return products;
    } catch (error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).exec();

      if (!product) {
        throw new Error('Product not found.');
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await ProductModel.findById(id).exec();

      if (!product) {
        throw new Error('Product not found.');
      }

      const { title, category, image, seller } = updatedFields;
      
      if (!title && !category && !image && !seller) {
        throw new Error('No fields to update.');
      }

      if (title) {
        product.title = title;
      }

      if (category) {
        product.category = category;
      }

      if (image) {
        product.image = image;
      }

      if (seller) {
        product.seller = seller;
      }

      const updatedProduct = await product.save();

      return updatedProduct;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndRemove(id).exec();

      if (!product) {
        throw new Error('Product not found.');
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async searchProducts(query) {
    try {
      const regex = new RegExp(query, 'i');
      const products = await ProductModel.find({
        $or: [
          { title: regex },
          { category: regex },
          { 'seller.name': regex },
        ],
      }).exec();

      return products;
    } catch (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }
}

export default ProductManager;
