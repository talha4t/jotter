import { Request, Response } from 'express';

import AuthService from '../services/auth.service';

export default class AuthController {
    static async register(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password, confirmPassword } = req.body;

            const result = await AuthService.register({
                name,
                email,
                password,
                confirmPassword,
            });

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login(email, password);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async verifyEmail(req: Request, res: Response): Promise<any> {
        try {
            const { email, verificationPin } = req.body;
            const result = await AuthService.verifyEmail(
                email,
                verificationPin,
            );
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async editUserInfo(req: Request, res: Response): Promise<any> {
        try {
            const { name } = req.body;
            const userId = req.user?.sub;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const result = await AuthService.editUserInfo(userId, name);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async forgotPassword(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            const result = await AuthService.forgotPassword(email);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<any> {
        try {
            const { email, resetPin, newPassword, confirmNewPassword } =
                req.body;

            const result = await AuthService.resetPassword(
                email,
                resetPin,
                newPassword,
                confirmNewPassword,
            );

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resendPin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            const result = await AuthService.resendPin(email);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async changePassword(req: Request, res: Response): Promise<any> {
        try {
            const { currentPassword, newPassword, confirmNewPassword } =
                req.body;

            const result = await AuthService.changePassword(
                req.user?.sub,
                currentPassword,
                newPassword,
                confirmNewPassword,
            );

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async logout(req: Request, res: Response): Promise<any> {
        try {
            const { refreshToken } = req.body;

            const result = await AuthService.logout(refreshToken);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteAccount(req: Request, res: Response): Promise<any> {
        try {
            const result = await AuthService.deleteAccount(req.user?.sub);

            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async refreshToken(req: Request, res: Response): Promise<any> {
        try {
            const { refreshToken } = req.body;

            const result = await AuthService.refreshToken(refreshToken);

            return res.status(result.status).json(result.data);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
