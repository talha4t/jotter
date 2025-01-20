import { Request, Response } from 'express';

import ImageService from '../services/image.service';

export default class ImageController {
    static async upload(req: Request, res: Response): Promise<any> {
        try {
            const { originalname, path: filePath, size } = req.file!;
            const result = await ImageService.uploadImage(
                originalname,
                filePath,
                size,
            );
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to upload image.' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const result = await ImageService.listImages();
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async copyFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const result = await ImageService.copyImageFile(id);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async renameFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { newName } = req.body;
            const result = await ImageService.renameImageFile(id, newName);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async duplicateFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const result = await ImageService.duplicateImageFile(id);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async isFavourite(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const result = await ImageService.toggleFavourite(id);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const result = await ImageService.deleteImageFile(id);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async moveFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { folder } = req.body;
            const result = await ImageService.moveImageFile(id, folder);
            return res.status(result.status).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
