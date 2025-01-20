import Pdf from '../models/pdf.model';

export default class PdfService {
    static async uploadPdf(file: Express.Multer.File) {
        try {
            const { originalname: name, path: filePath, size } = file;

            const existingPdf = await Pdf.findOne({ name });
            if (existingPdf) {
                throw new Error('A file with the same name already exists.');
            }

            const newPdf = new Pdf({ name, path: filePath, size });
            await newPdf.save();

            return { message: 'PDF uploaded successfully.', data: newPdf };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Upload PDF' },
            };
        }
    }

    static async listPdfs() {
        try {
            return await Pdf.find();
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Get List PDF' },
            };
        }
    }

    static async copyPdf(id: string) {
        try {
            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            const newName = `${pdf.name.split('.')[0]}_copy.${pdf.name.split('.').pop()}`;
            const copiedFile = new Pdf({
                ...pdf.toObject(),
                name: newName,
                _id: undefined,
            });

            await copiedFile.save();

            return { message: 'File copied successfully.', data: copiedFile };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Copy PDF' },
            };
        }
    }

    static async renamePdf(id: string, newName: string) {
        try {
            const existingPdf = await Pdf.findOne({ name: newName });
            if (existingPdf) {
                throw new Error('A file with this name already exists.');
            }

            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            pdf.name = newName;
            await pdf.save();

            return { message: 'File renamed successfully.', data: pdf };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Rename PDF' },
            };
        }
    }

    static async duplicatePdf(id: string) {
        try {
            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            const duplicateName = `${pdf.name.split('.')[0]}_duplicate.${pdf.name.split('.').pop()}`;
            const duplicateFile = new Pdf({
                ...pdf.toObject(),
                name: duplicateName,
                _id: undefined,
            });

            await duplicateFile.save();

            return {
                message: 'File duplicated successfully.',
                data: duplicateFile,
            };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Duplicate PDF' },
            };
        }
    }

    static async toggleFavourite(id: string) {
        try {
            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            pdf.isFavourite = !pdf.isFavourite;
            await pdf.save();

            return {
                message: pdf.isFavourite
                    ? 'Pdf added to favourites.'
                    : 'Pdf removed from favourites.',
                data: pdf,
            };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Make Favourite PDF' },
            };
        }
    }

    static async deletePdf(id: string) {
        try {
            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            await pdf.deleteOne();

            return { message: 'File deleted successfully from the database.' };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Delete PDF' },
            };
        }
    }

    static async movePdf(id: string, folder: string) {
        try {
            const pdf = await Pdf.findById(id);
            if (!pdf) {
                throw new Error('File not found.');
            }

            pdf.folder = folder;
            await pdf.save();

            return { message: 'File moved successfully.', data: pdf };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Error Moving PDF' },
            };
        }
    }
}
