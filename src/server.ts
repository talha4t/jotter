import app from './app';
import connectDB from './config/db/db.config';
import MailService from './config/mail/mail.config';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();

    try {
        await MailService.verifyConnection();
    } catch (error) {
        console.error('Failed to verify mail connection');
    }

    console.log(`Server is running on http://localhost:${PORT}`);
});
