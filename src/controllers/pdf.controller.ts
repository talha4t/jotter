import { Request, Response } from 'express';

import { verifyToken } from '../utils/token.util';

import Pdf from '../models/pdf.model';

export default class PdfController {
    static async upload(req: Request, res: Response): Promise<any> {
        try {
            const { originalname, path: filePath, size } = req.file!;
            const name = originalname;

            const existingPdf = await Pdf.findOne({ name });
            if (existingPdf) {
                return res.status(400).json({
                    error: 'A file with the same name already exists.',
                });
            }

            const newPdf = new Pdf({ name, path: filePath, size });
            await newPdf.save();

            return res.status(201).json({
                message: 'PDF uploaded successfully.',
                data: newPdf,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to upload PDF.' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const pdfs = await Pdf.find();

            return res.status(200).json(pdfs);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch PDFs.' });
        }
    }

    static async copyFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const pdf = await Pdf.findById(id);

            if (!pdf) {
                return res.status(404).json({ error: 'File not found.' });
            }

            const newName = `${pdf.name.split('.')[0]}_copy.${pdf.name.split('.').pop()}`;
            const copiedFile = new Pdf({
                ...pdf.toObject(),
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

            const existingPdf = await Pdf.findOne({ name: newName });
            if (existingPdf) {
                return res
                    .status(400)
                    .json({ error: 'A file with this name already exists.' });
            }

            const pdf = await Pdf.findById(id);
            if (!pdf) {
                return res.status(404).json({ error: 'File not found.' });
            }

            pdf.name = newName;
            await pdf.save();

            return res
                .status(200)
                .json({ message: 'File renamed successfully.', data: pdf });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to rename file.' });
        }
    }

    static async duplicateFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const pdf = await Pdf.findById(id);

            if (!pdf) {
                return res.status(404).json({ error: 'File not found.' });
            }

            const duplicateName = `${pdf.name.split('.')[0]}_duplicate.${pdf.name.split('.').pop()}`;
            const duplicateFile = new Pdf({
                ...pdf.toObject(),
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
            const pdf = await Pdf.findById(id);

            if (!pdf) {
                return res.status(404).json({ error: 'File not found.' });
            }

            await pdf.deleteOne();

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

            const pdf = await Pdf.findById(id);
            if (!pdf) {
                return res.status(404).json({ error: 'File not found.' });
            }

            pdf.folder = folder;
            await pdf.save();

            return res
                .status(200)
                .json({ message: 'File moved successfully.', data: pdf });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to move file.' });
        }
    }
}
