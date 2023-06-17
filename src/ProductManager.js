import fs from 'fs'

export default class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  getProducts() {
    const fileData = fs.readFileSync(this.filePath, 'utf8');
    const products = JSON.parse(fileData);
    return products;
  }

  addProduct(product) {
    const products = this.getProducts();
    const id = this.generateId();
    const newProduct = { id, ...product };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;
    this.saveProducts(products);
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = products.splice(productIndex, 1)[0];
    this.saveProducts(products);
    return deletedProduct;
  }

  generateId() {
    const products = this.getProducts();
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  saveProducts(products) {
    const fileData = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.filePath, fileData);
  }
}

