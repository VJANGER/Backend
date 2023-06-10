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

  getProducts() {
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

// // Ejemplo de uso
// const productManager = new ProductManager('products.json');

// console.log(productManager.getProducts()); // []

// const addedProduct = productManager.addProduct({
//   title: 'producto prueba',
//   description: 'Este es un producto prueba',
//   price: 200,
//   thumbnail: 'Sin imagen',
//   code: 'abc123',
//   stock: 25,
// });

// console.log(addedProduct); // { id: 1, title: 'producto prueba', ... }

// console.log(productManager.getProducts()); // [ { id: 1, title: 'producto prueba', ... } ]

// const retrievedProduct = productManager.getProductById(1);
// console.log(retrievedProduct); // { id: 1, title: 'producto prueba', ... }

// try {
//   productManager.getProductById(2); // Error: Producto no encontrado
// } catch (error) {
//   console.error(error.message);
// }

// const updatedProduct = productManager.updateProduct(1, { price: 250 });
// console.log(updatedProduct); // { id: 1, title: 'producto prueba', price: 250, ... }

// try {
//   productManager.updateProduct(2, { price: 300 }); // Error: Producto no encontrado
// } catch (error) {
//   console.error(error.message);
// }

// productManager.deleteProduct(1);
// console.log(productManager.getProducts()); // []

// try {
//   productManager.deleteProduct(2); // Error: Producto no encontrado
// } catch (error) {
//   console.error(error.message);
// }
