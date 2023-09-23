const express = require('express');
const router = express.Router();
const purchaseService = require('../services/purchaseService');

router.post('/:cid/purchase', async (req, res, next) => {
  const cartId = req.params.cid;

  try {
    const purchaseResult = await purchaseService.finalizePurchase(cartId);

    res.status(200).json({ success: true, message: 'Compra realizada con éxito', purchaseResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado
    const cartId = req.params.cid;
    
    const purchase = await purchaseService.createPurchase(userId, cartId);
    
    res.status(201).json({ success: true, purchase });
  } catch (error) {
    next(error);
  }
});

router.post('/', purchaseController.createPurchase);

router.post('/verify-stock', purchaseController.verifyStock);

module.exports = router;
