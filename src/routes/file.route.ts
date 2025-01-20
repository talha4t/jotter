import { Router } from 'express';

import FileController from '../controllers/file.controller';

import { authenticateToken } from '../middlewares/auth.middleware';

const fileRouter = Router();

fileRouter.use(
    ['/', '/create', 'favourite/:id', '/update/:id', '/delete/:id'],
    authenticateToken,
);

fileRouter.post('/create', FileController.create);
fileRouter.post('/favourite/:id', FileController.isFavourite);

fileRouter.get('/', FileController.list);

fileRouter.patch('/update/:id', FileController.update);

fileRouter.delete('/delete/:id', FileController.delete);

export default fileRouter;
