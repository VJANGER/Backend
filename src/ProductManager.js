import fs from 'fs'

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.initializeFile();
  }

  initializeFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]', 'utf-8');
    }
  }

  getProducts(){
    try {
      const fileData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      return [];
    }
  }

  addProduct(product) {
    const products = this.getProducts();
    const codeExists = products.some((p) => p.code === product.code);
    if (codeExists) {
      throw new Error('El código está repetido');
    }

    const lastId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
    const newProduct = { id: lastId + 1, ...product };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields, id };
      products[productIndex] = updatedProduct;
      this.saveProducts(products);
      return updatedProduct;
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const updatedProducts = products.filter((p) => p.id !== id);
    if (updatedProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }
    this.saveProducts(updatedProducts);
  }

  saveProducts(products) {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }
}

