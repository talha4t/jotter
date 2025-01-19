import { Router } from 'express';
import PdfController from '../controllers/pdf.controller';
import { uploadMiddleware } from '../middlewares/multer.middleware';

const pdfRouter = Router();

pdfRouter.get('/', PdfController.list);

pdfRouter.post('/upload', uploadMiddleware, PdfController.upload);
pdfRouter.post('/:id/copy', PdfController.copyFile);
pdfRouter.post('/:id/duplicate', PdfController.duplicateFile);

pdfRouter.patch('/rename/:id', PdfController.renameFile);
pdfRouter.patch('/move/:id', PdfController.moveFile);

pdfRouter.delete('/:id', PdfController.deleteFile);

export default pdfRouter;
