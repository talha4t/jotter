import { Request, Response } from 'express';

import Image from '../models/Image.model';

export default class ImageController {
    static async upload(req: Request, res: Response): Promise<any> {
        try {
            const { originalname, path: filePath, size } = req.file!;
            const name = originalname;

            const existingImage = await Image.findOne({ name });
            if (existingImage) {
                return res.status(400).json({
                    error: 'A file with the same name already exists.',
                });
            }

            const newImage = new Image({ name, path: filePath, size });
            await newImage.save();

            return res.status(201).json({
                message: 'Image uploaded successfully.',
                data: newImage,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to upload image.' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const images = await Image.find();

            return res.status(200).json(images);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch images.' });
        }
    }

    static async copyFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const image = await Image.findById(id);

            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            const newName = `${image.name.split('.')[0]}_copy.${image.name.split('.').pop()}`;
            const copiedFile = new Image({
                ...image.toObject(),
                name: newName,
                _id: undefined,
            });

            await copiedFile.save();

            return res.status(201).json({
                message: 'File copied successfully.',
                data: copiedFile,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to copy file.' });
        }
    }

    static async renameFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { newName } = req.body;

            const existingImage = await Image.findOne({ name: newName });
            if (existingImage) {
                return res
                    .status(400)
                    .json({ error: 'A file with this name already exists.' });
            }

            const image = await Image.findById(id);
            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            image.name = newName;
            await image.save();

            return res
                .status(200)
                .json({ message: 'File renamed successfully.', data: image });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to rename file.' });
        }
    }

    static async duplicateFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const image = await Image.findById(id);

            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            const duplicateName = `${image.name.split('.')[0]}_duplicate.${image.name.split('.').pop()}`;
            const duplicateFile = new Image({
                ...image.toObject(),
                name: duplicateName,
                _id: undefined,
            });

            await duplicateFile.save();

            return res.status(201).json({
                message: 'File duplicated successfully.',
                data: duplicateFile,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to duplicate file.' });
        }
    }

    static async deleteFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const image = await Image.findById(id);

            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            await image.deleteOne();

            return res.status(200).json({
                message: 'File deleted successfully from the database.',
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to delete file from the database.' });
        }
    }

    static async moveFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { folder } = req.body;

            const image = await Image.findById(id);
            if (!image) {
                return res.status(404).json({ error: 'File not found.' });
            }

            image.folder = folder;
            await image.save();

            return res
                .status(200)
                .json({ message: 'File moved successfully.', data: image });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to move file.' });
        }
    }
}
