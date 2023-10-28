const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/documents' });

router.post('/:uid/documents', upload.array('documents', 3), userController.uploadDocuments);
router.put('/premium/:uid', userController.updateToPremium);
router.post('/:uid/documents', multer.single('document'), userController.uploadDocument);

module.exports = router;
