import { Router } from 'express';

import LogsController from '../controllers/stats.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const statsRouter = Router();

statsRouter.use(
    ['/', '/pdfs', '/images', '/files', 'specific'],
    authenticateToken,
);

statsRouter.get('/', LogsController.getOverallStats);
statsRouter.get('/pdfs', LogsController.getPDFStats);
statsRouter.get('/images', LogsController.getImageStats);
statsRouter.get('/files', LogsController.getFileStats);
statsRouter.get('/specific', LogsController.getSpecificLogs);

export default statsRouter;
