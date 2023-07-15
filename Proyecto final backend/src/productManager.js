import { promises as fs } from 'fs';
import Product from './Product.js';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
  }

  getNextId() {
    const ids = this.products.map((product) => product.id);
    const maxId = Math.max(...ids);
    return maxId >= 0 ? maxId + 1 : 0;
  }

  addProduct(productData) {
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

      const product = new Product(title, category, image, seller);

      const newProduct = {
        id: this.getNextId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...product,
      };

      this.products.push(newProduct);
      this.saveProducts();

      return newProduct.id;
    } catch (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  getProducts(limit) {
    if (limit && limit > 0) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    try {
      const product = this.getProductById(id);

      const { title, category, image, seller } = updatedFields;
      
      if (!title && !category && !image && !seller) {
        throw new Error('No fields to update.');
      }

      const updatedProduct = {
        ...product,
        title: title || product.title,
        category: category || product.category,
        image: image || product.image,
        seller: {
          ...product.seller,
          ...(seller || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      const index = this.products.findIndex((p) => p.id === id);
      this.products[index] = updatedProduct;

      this.saveProducts();

      return updatedProduct;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Product not found.');
    }

    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    this.saveProducts();

    return deletedProduct;
  }

  searchProducts(query) {
    const results = this.products.filter((product) => {
      const { title, category, seller } = product;
      return (
        title.toLowerCase().includes(query.toLowerCase()) ||
        category.toLowerCase().includes(query.toLowerCase()) ||
        seller.name.toLowerCase().includes(query.toLowerCase())
      );
    });

    return results;
  }
}

export default ProductManager;
