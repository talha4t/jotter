import { Request, Response } from 'express';
import FileService from '../services/file.service';

export default class FileController {
    static async create(req: Request, res: Response): Promise<any> {
        try {
            const { name, content, folder } = req.body;

            const result = await FileService.createFile({
                name,
                content,
                folder,
            });

            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const result = await FileService.listFiles();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { name, content, folder } = req.body;

            const result = await FileService.updateFile(id, {
                name,
                content,
                folder,
            });

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async isFavourite(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await FileService.toggleFavourite(id);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await FileService.deleteFile(id);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
