import Pdf from '../models/pdf.model';

export default class PdfService {
    static async uploadPdf(file: Express.Multer.File) {
        const { originalname: name, path: filePath, size } = file;

        const existingPdf = await Pdf.findOne({ name });
        if (existingPdf) {
            throw new Error('A file with the same name already exists.');
        }

        const newPdf = new Pdf({ name, path: filePath, size });
        await newPdf.save();

        return { message: 'PDF uploaded successfully.', data: newPdf };
    }

    static async listPdfs() {
        return await Pdf.find();
    }

    static async copyPdf(id: string) {
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
    }

    static async renamePdf(id: string, newName: string) {
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
    }

    static async duplicatePdf(id: string) {
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
    }

    static async toggleFavourite(id: string) {
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
    }

    static async deletePdf(id: string) {
        const pdf = await Pdf.findById(id);
        if (!pdf) {
            throw new Error('File not found.');
        }

        await pdf.deleteOne();

        return { message: 'File deleted successfully from the database.' };
    }

    static async movePdf(id: string, folder: string) {
        const pdf = await Pdf.findById(id);
        if (!pdf) {
            throw new Error('File not found.');
        }

        pdf.folder = folder;
        await pdf.save();

        return { message: 'File moved successfully.', data: pdf };
    }
}
