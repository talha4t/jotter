import Image from '../models/Image.model';
import PDF from '../models/pdf.model';
import File from '../models/file.model';

export default class StatsService {
    static TOTAL_STORAGE = 10 * 1024 * 1024 * 1024; // 10 GB

    static async getOverallStats() {
        try {
            const [images, pdfs, files] = await Promise.all([
                Image.find(),
                PDF.find(),
                File.find(),
            ]);

            const imagesSize = images.reduce(
                (acc: any, image: any) => acc + (image.size || 0),
                0,
            );
            const pdfsSize = pdfs.reduce(
                (acc: any, pdf: any) => acc + (pdf.size || 0),
                0,
            );
            const filesSize = files.reduce(
                (acc: any, file: any) => acc + (file.size || 0),
                0,
            );

            const totalUsed = imagesSize + pdfsSize + filesSize;
            const availableSpace = StatsService.TOTAL_STORAGE - totalUsed;

            return {
                totalStorage: StatsService.TOTAL_STORAGE,
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
                    images: images.map(image => image.createdAt),
                    pdfs: pdfs.map(pdf => pdf.createdAt),
                    files: files.map(file => file.createdAt),
                },
                updatedAt: {
                    images: images.map(image => image.updatedAt),
                    pdfs: pdfs.map(pdf => pdf.updatedAt),
                    files: files.map(file => file.updatedAt),
                },
            };
        } catch (error) {
            throw new Error('Failed to fetch overall stats.');
        }
    }

    static async getPDFStats() {
        try {
            const pdfs = await PDF.find();
            const pdfsSize = pdfs.reduce(
                (acc: any, pdf: any) => acc + (pdf.size || 0),
                0,
            );

            return {
                totalStorage: StatsService.TOTAL_STORAGE,
                usedStorage: pdfsSize,
                availableStorage: StatsService.TOTAL_STORAGE - pdfsSize,
                itemCount: pdfs.length,
                createdAt: pdfs.map(pdf => pdf.createdAt),
                updatedAt: pdfs.map(pdf => pdf.updatedAt),
            };
        } catch (error) {
            throw new Error('Failed to fetch PDF stats.');
        }
    }

    static async getImageStats() {
        try {
            const images = await Image.find();
            const imagesSize = images.reduce(
                (acc: any, image: any) => acc + (image.size || 0),
                0,
            );

            return {
                totalStorage: StatsService.TOTAL_STORAGE,
                usedStorage: imagesSize,
                availableStorage: StatsService.TOTAL_STORAGE - imagesSize,
                itemCount: images.length,
                createdAt: images.map(image => image.createdAt),
                updatedAt: images.map(image => image.updatedAt),
            };
        } catch (error) {
            throw new Error('Failed to fetch image stats.');
        }
    }

    static async getFileStats() {
        try {
            const files = await File.find();
            const filesSize = files.reduce(
                (acc: any, file: any) => acc + (file.size || 0),
                0,
            );

            return {
                totalStorage: StatsService.TOTAL_STORAGE,
                usedStorage: filesSize,
                availableStorage: StatsService.TOTAL_STORAGE - filesSize,
                itemCount: files.length,
                createdAt: files.map(file => file.createdAt),
                updatedAt: files.map(file => file.updatedAt),
            };
        } catch (error) {
            throw new Error('Failed to fetch file stats.');
        }
    }

    static async getSpecificLogs(date: string) {
        try {
            const targetDate = new Date(date);
            const start = new Date(targetDate.setHours(0, 0, 0, 0));
            const end = new Date(targetDate.setHours(23, 59, 59, 999));

            const [images, pdfs, files] = await Promise.all([
                Image.find({ updatedAt: { $gte: start, $lte: end } }),
                PDF.find({ updatedAt: { $gte: start, $lte: end } }),
                File.find({ updatedAt: { $gte: start, $lte: end } }),
            ]);

            return {
                images,
                pdfs,
                files,
            };
        } catch (error) {
            throw new Error('Failed to fetch specific logs.');
        }
    }
}
