import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = productManager.getProducts(limit);
  res.json(products);
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/products', (req, res) => {
  try {
    const productId = productManager.addProduct(req.body);
    res.json({ id: productId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const updatedProduct = productManager.updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deletedProduct = productManager.deleteProduct(productId);
    res.json(deletedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
