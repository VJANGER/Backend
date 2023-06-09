import express from 'express';
import exphbs from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager('products.json');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('index', { products });
});

app.post('/products', (req, res) => {
  try {
    const productId = productManager.addProduct(req.body);
    const products = productManager.getProducts();
    io.emit('productsUpdated', products);
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    productManager.deleteProduct(productId);
    const products = productManager.getProducts();
    io.emit('productsUpdated', products);
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
