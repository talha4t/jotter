import { Router } from 'express';

import ImageController from '../controllers/image.controller';
import { uploadMiddleware } from '../middlewares/multer.middleware';

const router = Router();

router.get('/', ImageController.list);

router.post('/upload', uploadMiddleware, ImageController.upload);
router.post('/copy/:id', ImageController.copyFile);
router.post('/duplicate/:id', ImageController.duplicateFile);

router.patch('/rename/:id', ImageController.renameFile);
router.patch('/move/:id', ImageController.moveFile);

router.delete('/:id', ImageController.deleteFile);
export default router;
