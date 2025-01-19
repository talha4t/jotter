import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db/db.config';
import MailService from './config/mail/mail.config';

import authenticationRoutes from './routes/auth.route';
import imageRoutes from './routes/image.route';
import pdfRoutes from './routes/pdf.route';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Storage Management API is running!');
});

app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/pdfs', pdfRoutes);

app.listen(PORT, async () => {
    await connectDB();

    /*
        Mail Service Up & Down Function 
    */
    try {
        await MailService.verifyConnection();
    } catch (error) {
        console.error('Failed to verify mail connection');
    }

    console.log(`Server is running on http://localhost:${PORT}`);
});
