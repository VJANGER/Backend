import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const productManager = new ProductManager('products.json');


app.get('/products', (req, res) => {
  const { limit } = req.query;
  const products = productManager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

app.get('/products/:pid', (req, res) => {
  const { pid } = req.params;
  try {
    const product = productManager.getProductById(parseInt(pid));
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});

