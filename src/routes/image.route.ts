import { Router } from 'express';

import ImageController from '../controllers/image.controller';
import { uploadMiddleware } from '../middlewares/multer-image.middleware';

const imageRouter = Router();

imageRouter.get('/', ImageController.list);

imageRouter.post('/upload', uploadMiddleware, ImageController.upload);
imageRouter.post('/copy/:id', ImageController.copyFile);
imageRouter.post('/duplicate/:id', ImageController.duplicateFile);
imageRouter.post('/favourite/:id', ImageController.isFavourite);

imageRouter.patch('/rename/:id', ImageController.renameFile);
imageRouter.patch('/move/:id', ImageController.moveFile);

imageRouter.delete('/:id', ImageController.deleteFile);

export default imageRouter;
