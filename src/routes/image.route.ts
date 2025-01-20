import { Router } from 'express';

import { uploadMiddleware } from '../middlewares/multer-image.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

import ImageController from '../controllers/image.controller';

const imageRouter = Router();

imageRouter.use(
    [
        '/',
        'upload',
        '/copy/:id',
        '/duplicate/:id',
        '/favourite/:id',
        '/rename/:id',
        '/move/:id',
        '/delete/:id',
    ],
    authenticateToken,
);
imageRouter.get('/', ImageController.list);

imageRouter.post('/upload', uploadMiddleware, ImageController.upload);
imageRouter.post('/copy/:id', ImageController.copyFile);
imageRouter.post('/duplicate/:id', ImageController.duplicateFile);
imageRouter.post('/favourite/:id', ImageController.isFavourite);

imageRouter.patch('/rename/:id', ImageController.renameFile);
imageRouter.patch('/move/:id', ImageController.moveFile);

imageRouter.delete('/:id', ImageController.deleteFile);

export default imageRouter;
