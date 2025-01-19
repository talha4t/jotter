import { Request, Response } from 'express';
import Image from '../models/Image.model';
import PDF from '../models/pdf.model';
import File from '../models/file.model';

export default class LogsController {
    static TOTAL_STORAGE = 10 * 1024 * 1024 * 1024; // 10 GB

    static async getOverallStats(req: Request, res: Response): Promise<any> {
        try {
            const [images, pdfs, files] = await Promise.all([
                Image.find(),
                PDF.find(),
                File.find(),
            ]);

            const imagesSize = images.reduce(
                (acc: number, image: any) => acc + (image.size || 0),
                0,
            );
            const pdfsSize = pdfs.reduce(
                (acc: number, pdf: any) => acc + (pdf.size || 0),
                0,
            );
            const filesSize = files.reduce(
                (acc: number, file: any) => acc + (file.size || 0),
                0,
            );

            const totalUsed = imagesSize + pdfsSize + filesSize;
            const availableSpace = LogsController.TOTAL_STORAGE - totalUsed;

            return res.status(200).json({
                totalStorage: LogsController.TOTAL_STORAGE,
                usedStorage: totalUsed,
                availableStorage: availableSpace,
                itemCounts: {
                    images: images.length,
                    pdfs: pdfs.length,
                    files: files.length,
                },
                usageByType: {
                    images: imagesSize,
                    pdfs: pdfsSize,
                    files: filesSize,
                },
                createdAt: {
                    images: images.map((image: any) => image.createdAt),
                    pdfs: pdfs.map((pdf: any) => pdf.createdAt),
                    files: files.map((file: any) => file.createdAt),
                },
                updatedAt: {
                    images: images.map((image: any) => image.updatedAt),
                    pdfs: pdfs.map((pdf: any) => pdf.updatedAt),
                    files: files.map((file: any) => file.updatedAt),
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch overall stats.' });
        }
    }

    static async getPDFStats(req: Request, res: Response): Promise<any> {
        try {
            const pdfs = await PDF.find();
            const pdfsSize = pdfs.reduce(
                (acc: any, pdf: any) => acc + pdf.size,
                0,
            );

            return res.status(200).json({
                totalStorage: LogsController.TOTAL_STORAGE,
                usedStorage: pdfsSize,
                availableStorage: LogsController.TOTAL_STORAGE - pdfsSize,
                itemCount: pdfs.length,
                createdAt: pdfs.map((pdf: any) => pdf.createdAt),
                updatedAt: pdfs.map((pdf: any) => pdf.updatedAt),
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch PDF stats.' });
        }
    }

    static async getImageStats(req: Request, res: Response): Promise<any> {
        try {
            const images = await Image.find();
            const imagesSize = images.reduce(
                (acc: any, image: any) => acc + image.size,
                0,
            );

            return res.status(200).json({
                totalStorage: LogsController.TOTAL_STORAGE,
                usedStorage: imagesSize,
                availableStorage: LogsController.TOTAL_STORAGE - imagesSize,
                itemCount: images.length,
                createdAt: images.map((image: any) => image.createdAt),
                updatedAt: images.map((image: any) => image.updatedAt),
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch image stats.' });
        }
    }

    static async getFileStats(req: Request, res: Response): Promise<any> {
        try {
            const files = await File.find();
            const filesSize = files.reduce(
                (acc: any, file: any) => acc + file.size,
                0,
            );

            return res.status(200).json({
                totalStorage: LogsController.TOTAL_STORAGE,
                usedStorage: filesSize,
                availableStorage: LogsController.TOTAL_STORAGE - filesSize,
                itemCount: files.length,
                createdAt: files.map((file: any) => file.createdAt),
                updatedAt: files.map((file: any) => file.updatedAt),
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch file stats.' });
        }
    }

    static async getSpecificLogs(req: Request, res: Response): Promise<any> {
        try {
            const { date } = req.body;

            const targetDate = new Date(date as string);

            const start = new Date(targetDate.setHours(0, 0, 0, 0));
            const end = new Date(targetDate.setHours(23, 59, 59, 999));

            const [images, pdfs, files] = await Promise.all([
                Image.find({ updatedAt: { $gte: start, $lte: end } }),
                PDF.find({ updatedAt: { $gte: start, $lte: end } }),
                File.find({ updatedAt: { $gte: start, $lte: end } }),
            ]);

            return res.status(200).json({
                images,
                pdfs,
                files,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Failed to fetch specific logs.' });
        }
    }
}
