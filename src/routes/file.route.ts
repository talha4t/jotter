import { Router } from 'express';

import FileController from '../controllers/file.controller';

const fileRouter = Router();

fileRouter.post('/create', FileController.create);

fileRouter.get('/', FileController.list);

fileRouter.patch('/:id', FileController.update);

fileRouter.delete('/:id', FileController.delete);

export default fileRouter;
