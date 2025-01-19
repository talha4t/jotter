import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db/db.config';
import MailService from './config/mail/mail.config';

// All routes
import authRouter from './routes/auth.route';
import imageRouter from './routes/image.route';
import pdfRouter from './routes/pdf.route';
import fileRouter from './routes/file.route';
import statsRouter from './routes/stats.route';
import favouriteRouter from './routes/favourite.route';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Storage Management API is running!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/pdfs', pdfRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/favourites', favouriteRouter);

app.listen(PORT, async () => {
    await connectDB();

    try {
        await MailService.verifyConnection();
    } catch (error) {
        console.error('Failed to verify mail connection');
    }

    console.log(`Server is running on http://localhost:${PORT}`);
});
