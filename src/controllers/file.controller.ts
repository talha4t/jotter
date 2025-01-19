import { Request, Response } from 'express';

import File from '../models/file.model';

export default class FileController {
    static async create(req: Request, res: Response): Promise<any> {
        try {
            const { name, content, folder } = req.body;

            const existingFile = await File.findOne({ name });
            if (existingFile) {
                return res
                    .status(400)
                    .json({ error: 'A file with this name already exists.' });
            }

            const newFile = new File({ name, content, folder });
            await newFile.save();

            return res
                .status(201)
                .json({ message: 'File created successfully.', data: newFile });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create file.' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const files = await File.find();

            return res.status(200).json(files);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch files.' });
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { name, content, folder } = req.body;

            const file = await File.findById(id);
            if (!file) {
                return res.status(404).json({ error: 'File not found.' });
            }

            if (name) {
                const existingFile = await File.findOne({ name });
                if (existingFile && existingFile.id !== id) {
                    return res.status(400).json({
                        error: 'A file with this name already exists.',
                    });
                }
                file.name = name;
            }

            if (content !== undefined) {
                file.content = content;
            }

            if (folder !== undefined) {
                file.folder = folder;
            }

            await file.save();

            return res
                .status(200)
                .json({ message: 'File updated successfully.', data: file });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update file.' });
        }
    }

    static async isFavourite(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const image = await File.findById(id);

            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            image.isFavourite = !image.isFavourite;

            await image.save();

            return res.status(200).json({
                message: image.isFavourite
                    ? 'File added to favourites.'
                    : 'File removed from favourites.',
                data: image,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to update favourite status.' });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const file = await File.findById(id);
            if (!file) {
                return res.status(404).json({ error: 'File not found.' });
            }

            await file.deleteOne();

            return res
                .status(200)
                .json({ message: 'File deleted successfully.' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete file.' });
        }
    }
}
