const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

router.get('/', adminUserController.getAllUsers);
router.get('/:uid/edit', adminUserController.editUser);
router.post('/:uid/update', adminUserController.updateUser);
router.get('/:uid/delete', adminUserController.deleteUser);

module.exports = router;
