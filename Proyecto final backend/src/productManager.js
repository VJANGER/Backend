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

  async addProduct(productData) {
    try {
      const product = new Product(
        productData.title,
        productData.description,
        productData.price,
        productData.thumbnail,
        productData.code,
        productData.stock
      );

      const existingProduct = this.products.find((p) => p.code === product.code);
      if (existingProduct) {
        throw new Error('Product with the same code already exists.');
      }

      const newProduct = {
        id: this.getNextId(),
        ...product,
      };

      this.products.push(newProduct);
      await this.saveProducts();

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

  async updateProduct(id, updatedFields) {
    try {
      const product = this.getProductById(id);

      const updatedProduct = new Product(
        updatedFields.title || product.title,
        updatedFields.description || product.description,
        updatedFields.price || product.price,
        updatedFields.thumbnail || product.thumbnail,
        updatedFields.code || product.code,
        updatedFields.stock || product.stock
      );

      const index = this.products.findIndex((p) => p.id === id);
      this.products[index] = {
        id,
        ...updatedProduct,
      };

      await this.saveProducts();

      return this.products[index];
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Product not found.');
    }

    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    await this.saveProducts();

    return deletedProduct;
  }
}

export default ProductManager;
