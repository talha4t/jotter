import { Request, Response } from 'express';
import FavouriteService from '../services/favourite.service';

export default class FavouriteController {
    static async getFavourites(req: Request, res: Response): Promise<any> {
        try {
            const result = await FavouriteService.getFavourites();

            return res.status(200).json({
                message: 'Fetched all favourite items.',
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
