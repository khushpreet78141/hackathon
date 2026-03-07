import { register, login, getMe, logout } from '../Controllers/authController.js';
import { otpGenerat } from '../Controllers/otpController.js';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', getMe);
router.post('/logout', logout);
router.post('/otp', otpGenerat);

export default router;