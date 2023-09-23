const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
app.use(express.static('public'));
app.use('/api', productRoutes);

app.set('view engine', 'handlebars');
app.set('views', 'views');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = router;
