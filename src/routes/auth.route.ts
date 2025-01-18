import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/verify-email', AuthController.verifyEmail);
router.post('/auth/resend-pin', AuthController.resendPin);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);

export default router;
