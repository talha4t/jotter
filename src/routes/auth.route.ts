import { Router } from 'express';

import { authenticateToken } from '../middlewares/auth.middleware';

import AuthController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.use(['/change-password', '/delete-account'], authenticateToken);

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

authRouter.put('/change-password', AuthController.changePassword);

authRouter.delete('/delete-account', AuthController.deleteAccount);

export default authRouter;
