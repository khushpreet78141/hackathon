import { register, login, getMe, logout, changePassword } from '../Controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { otpGenerat } from '../Controllers/otpController.js';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', protect, getMe);
router.post('/logout', logout);
router.post('/otp', otpGenerat);
router.post('/change-password', protect, changePassword);

export default router;