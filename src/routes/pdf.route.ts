import { Router } from 'express';
import PdfController from '../controllers/pdf.controller';
import { uploadMiddleware } from '../middlewares/multer-pdf.middleware';

const pdfRouter = Router();

pdfRouter.get('/', PdfController.list);

pdfRouter.post('/upload', uploadMiddleware, PdfController.upload);
pdfRouter.post('/copy/:id', PdfController.copyFile);
pdfRouter.post('/duplicate/:id', PdfController.duplicateFile);
pdfRouter.post('/favourite/:id', PdfController.isFavourite);

pdfRouter.patch('/rename/:id', PdfController.renameFile);
pdfRouter.patch('/move/:id', PdfController.moveFile);

pdfRouter.delete('/:id', PdfController.deleteFile);

export default pdfRouter;
