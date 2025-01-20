import argon from 'argon2';

import User from '../models/user.model';
import MailService from '../config/mail/mail.config';

import { isEmailValid } from '../utils/email-validator.util';
import { generateToken, verifyToken } from '../utils/token.util';

export default class AuthService {
    static async register(data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }): Promise<any> {
        try {
            const { name, email, password, confirmPassword } = data;

            if (password !== confirmPassword) {
                return {
                    status: 400,
                    data: { message: 'Passwords do not match' },
                };
            }

            const isValidEmail = await isEmailValid(email);
            if (!isValidEmail) {
                return {
                    status: 400,
                    data: { message: 'Invalid email address' },
                };
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                if (!existingUser.isVerified) {
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
                    return {
                        status: 200,
                        data: { message: 'Verification email resent' },
                    };
                }
                return {
                    status: 400,
                    data: { message: 'Email already in use' },
                };
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

            return {
                status: 201,
                data: {
                    message:
                        'User registered. Verify your email to activate your account.',
                },
            };
        } catch (error) {
            console.error('Error in AuthService register:', error);
            return { status: 500, data: { message: 'Internal server error' } };
        }
    }

    static async login(email: string, password: string) {
        try {
            const user = await User.findOne({ email });

            if (!user || !(await argon.verify(user.password, password))) {
                return {
                    status: 400,
                    data: { message: 'Invalid email or password' },
                };
            }

            if (!user.isVerified) {
                return {
                    status: 403,
                    data: { message: 'Verify your email to login' },
                };
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

            return {
                status: 200,
                data: { accessToken, refreshToken },
            };
        } catch (error) {
            throw new Error('An error occurred while processing the login');
        }
    }

    static async verifyEmail(email: string, verificationPin: string) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return {
                    status: 400,
                    data: { message: 'Invalid email or PIN' },
                };
            }

            const isPinValid = await argon.verify(
                user.verificationPin,
                verificationPin,
            );

            if (!isPinValid) {
                return {
                    status: 400,
                    data: { message: 'Invalid verification PIN' },
                };
            }

            user.isVerified = true;
            user.verificationPin = '';

            await user.save();

            return {
                status: 200,
                data: { message: 'Email verified successfully' },
            };
        } catch (error) {
            throw new Error('An error occurred while verifying the email');
        }
    }

    static async editUserInfo(userId: string | undefined, name: string) {
        try {
            if (!userId) {
                return {
                    status: 400,
                    data: { message: 'User ID is required' },
                };
            }

            if (!name) {
                return {
                    status: 400,
                    data: { message: 'Name is required' },
                };
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name },
                { new: true },
            );

            if (!updatedUser) {
                return {
                    status: 404,
                    data: { message: 'User not found' },
                };
            }

            return {
                status: 200,
                data: {
                    message: 'User info updated successfully',
                    user: updatedUser,
                },
            };
        } catch (error) {
            throw new Error('An error occurred while updating user info');
        }
    }

    static async forgotPassword(email: string) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return {
                    status: 200,
                    data: { message: 'If email exists, reset PIN sent' },
                };
            }

            const resetPin = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();
            const hashedResetPin = await argon.hash(resetPin);

            user.resetPasswordPin = hashedResetPin;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);

            await user.save();

            await MailService.sendResetPasswordEmail(email, resetPin);

            return {
                status: 200,
                data: { message: 'If email exists, reset PIN sent' },
            };
        } catch (error) {
            throw new Error(
                'An error occurred while sending the reset password email',
            );
        }
    }

    static async resetPassword(
        email: string,
        resetPin: string,
        newPassword: string,
        confirmNewPassword: string,
    ) {
        try {
            if (newPassword !== confirmNewPassword) {
                return {
                    status: 400,
                    data: { message: 'Passwords do not match' },
                };
            }

            const user = await User.findOne({ email });

            if (
                !user ||
                !user.resetPasswordPin ||
                !user.resetPasswordExpires ||
                user.resetPasswordExpires < new Date()
            ) {
                return {
                    status: 403,
                    data: { message: 'Invalid or expired reset PIN' },
                };
            }

            const isPinValid = await argon.verify(
                user.resetPasswordPin,
                resetPin,
            );
            if (!isPinValid) {
                return {
                    status: 403,
                    data: { message: 'Invalid reset PIN' },
                };
            }

            user.password = await argon.hash(newPassword);
            user.resetPasswordPin = '';
            user.resetPasswordExpires = undefined;

            await user.save();

            return {
                status: 200,
                data: { message: 'Password reset successful' },
            };
        } catch (error) {
            throw new Error('An error occurred while resetting the password');
        }
    }

    static async resendPin(email: string) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return {
                    status: 400,
                    data: { message: 'Invalid email address' },
                };
            }

            if (user.isVerified) {
                return {
                    status: 400,
                    data: {
                        message: 'User is already verified. No need for PIN',
                    },
                };
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

            return {
                status: 200,
                data: { message: 'Verification email resent' },
            };
        } catch (error) {
            throw new Error(
                'An error occurred while resending the verification PIN',
            );
        }
    }

    static async changePassword(
        userId: string | undefined,
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string,
    ) {
        try {
            if (!userId) {
                return { status: 401, data: { message: 'Unauthorized' } };
            }

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return {
                    status: 400,
                    data: { message: 'All fields are required' },
                };
            }

            if (newPassword !== confirmNewPassword) {
                return {
                    status: 400,
                    data: { message: 'Passwords do not match' },
                };
            }

            const user = await User.findById(userId);
            if (!user) {
                return { status: 404, data: { message: 'User not found' } };
            }

            const isPasswordValid = await argon.verify(
                user.password,
                currentPassword,
            );
            if (!isPasswordValid) {
                return {
                    status: 400,
                    data: { message: 'Current password is incorrect' },
                };
            }

            const hashedNewPassword = await argon.hash(newPassword);

            user.password = hashedNewPassword;
            await user.save();

            return {
                status: 200,
                data: { message: 'Password changed successfully' },
            };
        } catch (error) {
            throw new Error('An error occurred while changing the password');
        }
    }

    static async logout(refreshToken: string) {
        try {
            if (!refreshToken) {
                return {
                    status: 400,
                    data: { message: 'Refresh token is required' },
                };
            }

            const user = await User.findOne({ refreshToken });

            if (!user) {
                return {
                    status: 200,
                    data: { message: 'Logged out successfully' },
                };
            }

            user.refreshToken = '';
            await user.save();

            return {
                status: 200,
                data: { message: 'Logged out successfully' },
            };
        } catch (error) {
            throw new Error('An error occurred while logging out');
        }
    }

    static async deleteAccount(userId: string | undefined) {
        try {
            if (!userId) {
                return {
                    status: 400,
                    data: { message: 'User not authenticated' },
                };
            }

            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return { status: 404, data: { message: 'User not found' } };
            }

            return {
                status: 200,
                data: { message: 'Account deleted successfully' },
            };
        } catch (error) {
            throw new Error('An error occurred while deleting the account');
        }
    }

    static async refreshToken(refreshToken: string) {
        try {
            if (!refreshToken) {
                return {
                    status: 400,
                    data: { message: 'Refresh token is required.' },
                };
            }

            let decoded;
            try {
                decoded = verifyToken(refreshToken);
            } catch {
                return {
                    status: 401,
                    data: { message: 'Invalid or expired refresh token.' },
                };
            }

            const user = await User.findById(decoded.sub);

            if (!user || user.refreshToken !== refreshToken) {
                return {
                    status: 403,
                    data: { message: 'Invalid refresh token.' },
                };
            }

            const newAccessToken = generateToken(
                { sub: user.id, email: user.email },
                process.env.ACCESS_TOKEN_EXPIRY!,
            );

            return {
                status: 200,
                data: { accessToken: newAccessToken },
            };
        } catch (error) {
            throw new Error('An error occurred while refreshing the token');
        }
    }
}
