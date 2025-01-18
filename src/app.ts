import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import userRouter from './routes/auth.route';
import connectDB from './config/db/db.config';
import MailService from './config/mail/mail.config';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Storage Management API is running!');
});

app.use('/api/v1/', userRouter);

app.listen(PORT, async () => {
    await connectDB();
    try {
        await MailService.verifyConnection();
    } catch (error) {
        console.error('Failed to verify mail connection');
    }

    console.log(`Server is running on http://localhost:${PORT}`);
});
