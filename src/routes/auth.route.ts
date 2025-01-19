import { Router } from 'express';

import AuthController from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/verify-email', AuthController.verifyEmail);
authRouter.post('/resend-pin', AuthController.resendPin);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);
authRouter.post(
    '/refresh-token',
    authenticateToken,
    AuthController.refreshToken,
);

authRouter.patch('/edit-user', authenticateToken, AuthController.editUserInfo);

authRouter.delete(
    '/delete-account',
    authenticateToken,
    AuthController.deleteAccount,
);

export default authRouter;
