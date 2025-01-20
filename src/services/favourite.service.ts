import Image from '../models/Image.model';
import Pdf from '../models/pdf.model';
import File from '../models/file.model';

export default class FavouriteService {
    static async getFavourites() {
        try {
            const favouriteImages = await Image.find({ isFavourite: true });
            const favouritePdfs = await Pdf.find({ isFavourite: true });
            const favouriteFiles = await File.find({ isFavourite: true });

            return {
                images: favouriteImages,
                pdfs: favouritePdfs,
                files: favouriteFiles,
            };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Failed To Fetch All Info' },
            };
        }
    }
}
