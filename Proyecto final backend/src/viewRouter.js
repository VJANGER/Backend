import express from 'express';
import { renderLogin, renderRegister, renderProfile } from '../controllers/viewController.js';
import { requireNoAuth, requireAuth } from '../middlewares.js';

const router = express.Router();

router.get('/login', requireNoAuth, renderLogin);
router.get('/register', requireNoAuth, renderRegister);
router.get('/profile', requireAuth, renderProfile);

export default router;
