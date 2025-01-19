import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/verify-email', AuthController.verifyEmail);
authRouter.post('/resend-pin', AuthController.resendPin);
authRouter.post('/login', AuthController.login);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);
authRouter.post('/refresh-token', AuthController.refreshToken);

export default authRouter;
