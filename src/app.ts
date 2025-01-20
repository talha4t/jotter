import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import authRouter from './routes/auth.route';
import imageRouter from './routes/image.route';
import pdfRouter from './routes/pdf.route';
import fileRouter from './routes/file.route';
import statsRouter from './routes/stats.route';
import favouriteRouter from './routes/favourite.route';

dotenv.config();

const app: Application = express();

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

export default app;
