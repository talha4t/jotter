import { Router } from 'express';
import LogsController from '../controllers/stats.controller';

const statsRouter = Router();

statsRouter.get('/', LogsController.getOverallStats);
statsRouter.get('/pdfs', LogsController.getPDFStats);
statsRouter.get('/images', LogsController.getImageStats);
statsRouter.get('/files', LogsController.getFileStats);
statsRouter.get('/specific', LogsController.getSpecificLogs);

export default statsRouter;
