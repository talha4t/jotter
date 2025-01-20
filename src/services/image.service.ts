import Image from '../models/Image.model';

export default class ImageService {
    static async uploadImage(name: string, filePath: string, size: number) {
        const existingImage = await Image.findOne({ name });
        if (existingImage) {
            return {
                status: 400,
                data: { error: 'A file with the same name already exists.' },
            };
        }

        const newImage = new Image({ name, path: filePath, size });
        await newImage.save();

        return {
            status: 201,
            data: {
                message: 'Image uploaded successfully.',
                data: newImage,
            },
        };
    }

    static async listImages() {
        const images = await Image.find();
        return {
            status: 200,
            data: images,
        };
    }

    static async copyImageFile(id: string) {
        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        const newName = `${image.name.split('.')[0]}_copy.${image.name.split('.').pop()}`;
        const copiedFile = new Image({
            ...image.toObject(),
            name: newName,
            _id: undefined,
        });
        await copiedFile.save();

        return {
            status: 201,
            data: { message: 'File copied successfully.', data: copiedFile },
        };
    }

    static async renameImageFile(id: string, newName: string) {
        const existingImage = await Image.findOne({ name: newName });
        if (existingImage) {
            return {
                status: 400,
                data: { error: 'A file with this name already exists.' },
            };
        }

        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        image.name = newName;
        await image.save();

        return {
            status: 200,
            data: { message: 'File renamed successfully.', data: image },
        };
    }

    static async duplicateImageFile(id: string) {
        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        const duplicateName = `${image.name.split('.')[0]}_duplicate.${image.name.split('.').pop()}`;
        const duplicateFile = new Image({
            ...image.toObject(),
            name: duplicateName,
            _id: undefined,
        });
        await duplicateFile.save();

        return {
            status: 201,
            data: {
                message: 'File duplicated successfully.',
                data: duplicateFile,
            },
        };
    }

    static async toggleFavourite(id: string) {
        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        image.isFavourite = !image.isFavourite;
        await image.save();

        return {
            status: 200,
            data: {
                message: image.isFavourite
                    ? 'Image added to favourites.'
                    : 'Image removed from favourites.',
                data: image,
            },
        };
    }

    static async deleteImageFile(id: string) {
        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        await image.deleteOne();
        return {
            status: 200,
            data: { message: 'File deleted successfully from the database.' },
        };
    }

    static async moveImageFile(id: string, folder: string) {
        const image = await Image.findById(id);
        if (!image) {
            return { status: 404, data: { error: 'File not found.' } };
        }

        image.folder = folder;
        await image.save();

        return {
            status: 200,
            data: { message: 'File moved successfully.', data: image },
        };
    }
}
