const purchaseService = require('./purchaseService');

async function createPurchase(req, res) {
  try {
    const { userId, cartId } = req.body;
    const result = await purchaseService.createPurchase(userId, cartId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la compra' });
  }
}

async function verifyStock(req, res) {
  try {
    const { cartItems } = req.body;
    const result = await purchaseService.verifyStock(cartItems);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar el stock' });
  }
}

module.exports = {
  createPurchase,
  verifyStock,
};
