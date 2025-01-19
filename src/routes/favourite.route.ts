import { Router } from 'express';

import FavouriteController from '../controllers/favourite.controller';

const favouriteRouter = Router();

favouriteRouter.get('/', FavouriteController.getFavourites);

export default favouriteRouter;
