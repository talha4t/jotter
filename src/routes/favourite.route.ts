import { Router } from 'express';

import FavouriteController from '../controllers/favourite.controller';

import { authenticateToken } from '../middlewares/auth.middleware';

const favouriteRouter = Router();

favouriteRouter.get('/', authenticateToken, FavouriteController.getFavourites);

export default favouriteRouter;
