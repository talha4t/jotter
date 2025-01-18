import { Request, Response } from 'express';
import argon from 'argon2';

import User from '../models/user.model';
import { generateToken, verifyToken } from '../utils/token.util';
import MailService from '../config/mail/mail.config';
import { isEmailValid } from '../validators/email.validator';

export default class AuthController {
    static async register(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res
                    .status(400)
                    .json({ message: 'Passwords do not match' });
            }

            const isValidEmail = await isEmailValid(email);
            if (!isValidEmail) {
                return res
                    .status(400)
                    .json({ message: 'Invalid email address' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                if (!existingUser.isVerified) {
                    // Resend verification email if the user is not verified
                    const verificationPin = Math.floor(
                        100000 + Math.random() * 900000,
                    ).toString();
                    existingUser.verificationPin =
                        await argon.hash(verificationPin);
                    await existingUser.save();

                    await MailService.sendVerificationEmail(
                        existingUser.email,
                        verificationPin,
                    );
                    return res
                        .status(200)
                        .json({ message: 'Verification email resent' });
                }
                return res
                    .status(400)
                    .json({ message: 'Email already in use' });
            }

            const hashedPassword = await argon.hash(password);

            const verificationPin = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();
            const hashedPin = await argon.hash(verificationPin);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                verificationPin: hashedPin,
                isVerified: false,
            });

            await MailService.sendVerificationEmail(
                user.email,
                verificationPin,
            );

            return res.status(201).json({
                message:
                    'User registered. Verify your email to activate your account.',
            });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async verifyEmail(req: Request, res: Response): Promise<any> {
        try {
            const { email, verificationPin } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Invalid email or PIN' });
            }

            const isPinValid = await argon.verify(
                user.verificationPin,
                verificationPin,
            );
            if (!isPinValid) {
                return res
                    .status(400)
                    .json({ message: 'Invalid verification PIN' });
            }

            user.isVerified = true;
            user.verificationPin = '';

            await user.save();

            return res
                .status(200)
                .json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error('Error during email verification:', error);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resendPin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Invalid email address' });
            }

            if (user.isVerified) {
                return res.status(400).json({
                    message: 'User is already verified. No need for PIN',
                });
            }

            const verificationPin = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();
            const hashedPin = await argon.hash(verificationPin);

            user.verificationPin = hashedPin;
            await user.save();

            await MailService.sendVerificationEmail(
                user.email,
                verificationPin,
            );

            return res
                .status(200)
                .json({ message: 'Verification email resent' });
        } catch (error) {
            console.error('Error during PIN resend:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !(await argon.verify(user.password, password))) {
                return res
                    .status(400)
                    .json({ message: 'Invalid email or password' });
            }

            if (!user.isVerified) {
                return res
                    .status(403)
                    .json({ message: 'Verify your email to login' });
            }

            const accessToken = generateToken(
                { sub: user.id, email: user.email },
                process.env.ACCESS_TOKEN_EXPIRY!,
            );

            const refreshToken = generateToken(
                { sub: user.id },
                process.env.REFRESH_TOKEN_EXPIRY!,
            );

            user.refreshToken = refreshToken;
            await user.save();

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            console.log('errrrrrrrrrr', error);

            res.status(500).json({ message: error });
        }
    }

    static async forgotPassword(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(200)
                    .json({ message: 'If email exists, reset PIN sent' });
            }

            const resetPin = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();

            const hashedResetPin = await argon.hash(resetPin);

            user.resetPasswordPin = hashedResetPin;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);

            await user.save();

            await MailService.sendResetPasswordEmail(email, resetPin);

            res.status(200).json({
                message: 'If email exists, reset PIN sent',
            });
        } catch (error) {
            console.error('Error during forgot password:', error);

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<any> {
        try {
            const { email, resetPin, password } = req.body;
            const user = await User.findOne({ email });

            if (
                !user ||
                !user.resetPasswordPin ||
                !user.resetPasswordExpires ||
                user.resetPasswordExpires < new Date()
            ) {
                return res
                    .status(403)
                    .json({ message: 'Invalid or expired reset PIN' });
            }

            const isPinValid = await argon.verify(
                user.resetPasswordPin,
                resetPin,
            );
            if (!isPinValid) {
                return res.status(403).json({ message: 'Invalid reset PIN' });
            }

            user.password = await argon.hash(password);
            user.resetPasswordPin = '';
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Error during password reset:', error);

            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
