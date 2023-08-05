import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/sessionController.js';
import { requireNoAuth } from '../middlewares.js';

const router = express.Router();

router.post('/register', requireNoAuth, registerUser);
router.post('/login', requireNoAuth, loginUser);
router.post('/logout', requireAuth, logoutUser);

export default router;
