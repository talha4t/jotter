import { Request, Response } from 'express';

import Image from '../models/Image.model';
import Pdf from '../models/pdf.model';
import File from '../models/file.model';

export default class FavouriteController {
    static async getFavourites(req: Request, res: Response): Promise<any> {
        try {
            const favouriteImages = await Image.find({ isFavourite: true });
            const favouritePdfs = await Pdf.find({ isFavourite: true });
            const favouriteFiles = await File.find({ isFavourite: true });

            return res.status(200).json({
                message: 'Fetched all favourite items.',
                data: {
                    images: favouriteImages,
                    pdfs: favouritePdfs,
                    files: favouriteFiles,
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch favourite items.' });
        }
    }
}
