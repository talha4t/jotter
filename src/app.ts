import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Storage Management API is running!');
});

app.listen(PORT, async () => {
    await connectDB();

    console.log(`Server is running on http://localhost:${PORT}`);
});
