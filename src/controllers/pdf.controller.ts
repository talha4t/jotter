import { Request, Response } from 'express';
import PdfService from '../services/pdf.service';

export default class PdfController {
    static async upload(req: Request, res: Response): Promise<any> {
        try {
            const { file } = req;

            const result = await PdfService.uploadPdf(file!);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async list(req: Request, res: Response): Promise<any> {
        try {
            const pdfs = await PdfService.listPdfs();

            return res.status(200).json(pdfs);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async copyFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await PdfService.copyPdf(id);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async renameFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { newName } = req.body;

            const result = await PdfService.renamePdf(id, newName);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async duplicateFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await PdfService.duplicatePdf(id);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async isFavourite(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await PdfService.toggleFavourite(id);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await PdfService.deletePdf(id);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async moveFile(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { folder } = req.body;

            const result = await PdfService.movePdf(id, folder);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
