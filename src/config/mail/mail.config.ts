import nodemailer from 'nodemailer';

export default class MailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT) || 588,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        debug: true,
        logger: true,
    });

    static async sendVerificationEmail(email: string, pin: string) {
        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Your verification code is: <strong>${pin}</strong></p>`,
        });
    }

    static async sendResetPasswordEmail(email: string, resetPin: string) {
        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Reset Your Password',
            html: `
                <p>You requested to reset your password. Use the following PIN to reset it:</p>
                <div style="text-align: center; font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; border-radius: 8px;">
                    ${resetPin}
                </div>
                <p>This PIN is valid for 1 hour. If you did not request this, please ignore this email.</p>
            `,
        });
    }
}
