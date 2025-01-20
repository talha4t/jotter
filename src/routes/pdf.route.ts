import { Router } from 'express';

import { uploadMiddleware } from '../middlewares/multer-pdf.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

import PdfController from '../controllers/pdf.controller';

const pdfRouter = Router();

pdfRouter.use(
    [
        '/',
        '/upload',
        '/copy/:id',
        '/duplicate/:id',
        '/favourite/:id',
        '/rename/:id',
        '/move/:id',
        '/:id',
    ],
    authenticateToken,
);

pdfRouter.get('/', PdfController.list);

pdfRouter.post('/upload', uploadMiddleware, PdfController.upload);
pdfRouter.post('/copy/:id', PdfController.copyFile);
pdfRouter.post('/duplicate/:id', PdfController.duplicateFile);
pdfRouter.post('/favourite/:id', PdfController.isFavourite);

pdfRouter.patch('/rename/:id', PdfController.renameFile);
pdfRouter.patch('/move/:id', PdfController.moveFile);

pdfRouter.delete('/:id', PdfController.deleteFile);

export default pdfRouter;
