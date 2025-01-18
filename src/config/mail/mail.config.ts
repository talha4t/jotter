import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export default class MailService {
    private static transporter: Transporter;
    private static readonly REQUIRED_ENV_VARS = [
        'MAIL_USER',
        'MAIL_PASSWORD',
        'MAIL_FROM',
    ];

    private static getTransporter(): Transporter {
        if (!this.transporter) {
            const missingVars = this.REQUIRED_ENV_VARS.filter(
                varName => !process.env[varName],
            );
            if (missingVars.length) {
                throw new Error(
                    `Missing environment variables: ${missingVars.join(', ')}`,
                );
            }

            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
        }
        return this.transporter;
    }

    static async verifyConnection(): Promise<boolean> {
        try {
            await this.getTransporter().verify();

            console.log('📧 Mail server connection successful');

            return true;
        } catch (error) {
            throw new Error(`Mail server connection failed: ${error}`);
        }
    }

    static async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
        try {
            const info = await this.getTransporter().sendMail({
                from: process.env.MAIL_FROM,
                to,
                subject,
                html,
            });
            console.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            throw new Error(`Failed to send email: ${error}`);
        }
    }

    static async sendVerificationEmail(
        email: string,
        pin: string,
    ): Promise<void> {
        const emailContent = this.getVerificationEmailTemplate(pin);
        await this.sendEmail({
            to: email,
            subject: 'Verify Your Email',
            html: emailContent,
        });
    }

    static async sendResetPasswordEmail(
        email: string,
        resetPin: string,
    ): Promise<void> {
        const emailContent = this.getResetPasswordEmailTemplate(resetPin);
        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html: emailContent,
        });
    }

    private static getVerificationEmailTemplate(pin: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Your verification code is:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                    ${pin}
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 1 hour.</p>
            </div>
        `;
    }

    private static getResetPasswordEmailTemplate(resetPin: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password. Use the following PIN:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                    ${resetPin}
                </div>
                <p style="color: #666; font-size: 14px;">This PIN is valid for 1 hour. If you did not request this, please ignore this email.</p>
            </div>
        `;
    }
}
