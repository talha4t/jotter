import { Router } from 'express';

import ImageController from '../controllers/image.controller';
import { uploadMiddleware } from '../middlewares/multer.middleware';

const router = Router();

router.get('/', ImageController.list);

router.post('/upload', uploadMiddleware, ImageController.upload);
router.post('/:id/copy', ImageController.copyFile);
router.post('/:id/duplicate', ImageController.duplicateFile);

router.patch('/:id/rename', ImageController.renameFile);
router.patch('/:id/move', ImageController.moveFile);

router.delete('/:id', ImageController.deleteFile);
export default router;
