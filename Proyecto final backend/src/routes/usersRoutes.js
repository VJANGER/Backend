const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/documents' });
const multerMiddleware = require('../middleware/multerMiddleware');


router.post('/:uid/documents', upload.array('documents', 3), userController.uploadDocuments);
router.put('/premium/:uid', userController.updateToPremium);
router.post('/:uid/documents', multer.single('document'), userController.uploadDocument);
router.post('/:uid/documents', upload.array('documents', 5), userController.uploadDocuments);
router.post('/:uid/documents', userController.uploadDocuments, userController.updateUserDocuments);
router.post('/:uid/documents', multerMiddleware.array('documents', 5), userController.updateUserDocuments);
router.get('/', userController.getAllUsers);
router.get('/admin-view', userController.adminView);
router.delete('/', userController.deleteInactiveUsers);





module.exports = router;
