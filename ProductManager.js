const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    const newProduct = { ...product, id: lastId + 1 };
    products.push(newProduct);
    this.saveProducts(products);
  }

  getProducts() {
    try {
      const fileData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      return [];
    }
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
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      this.saveProducts(products);
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const updatedProducts = products.filter((p) => p.id !== id);
    this.saveProducts(updatedProducts);
  }

  saveProducts(products) {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }
}

// Ejemplo de uso
const productManager = new ProductManager('products.json');

console.log(productManager.getProducts()); // []

productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
});

console.log(productManager.getProducts()); // [ { id: 1, title: 'producto prueba', ... } ]

try {
  productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
} catch (error) {
  console.error(error.message); // Error: El código está repetido
}

console.log(productManager.getProductById(1)); // { id: 1, title: 'producto prueba', ... }

try {
  console.log(productManager.getProductById(2)); // Error: Producto no encontrado
} catch (error) {
  console.error(error.message);
}

productManager.updateProduct(1, { price: 250 });

console.log(productManager.getProductById(1)); // { id: 1, title: 'producto prueba', price: 250, ... }

productManager.deleteProduct(1);

console.log(productManager.getProducts()); // []
