import Image from '../models/Image.model';

export default class ImageService {
    static async uploadImage(name: string, filePath: string, size: number) {
        try {
            const existingImage = await Image.findOne({ name });
            if (existingImage) {
                return {
                    status: 400,
                    data: {
                        error: 'A file with the same name already exists.',
                    },
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
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Image Upload Error.' },
            };
        }
    }

    static async listImages() {
        try {
            const images = await Image.find();
            return {
                status: 200,
                data: images,
            };
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error retrieving images.' },
            };
        }
    }

    static async copyImageFile(id: string) {
        try {
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
                data: {
                    message: 'File copied successfully.',
                    data: copiedFile,
                },
            };
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error Copying File.' },
            };
        }
    }

    static async renameImageFile(id: string, newName: string) {
        try {
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
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error renaming file.' },
            };
        }
    }

    static async duplicateImageFile(id: string) {
        try {
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
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error Duplicating File.' },
            };
        }
    }

    static async toggleFavourite(id: string) {
        try {
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
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error Toggling Favourite Status.' },
            };
        }
    }

    static async deleteImageFile(id: string) {
        try {
            const image = await Image.findById(id);
            if (!image) {
                return { status: 404, data: { error: 'File not found.' } };
            }

            await image.deleteOne();

            return {
                status: 200,
                data: {
                    message: 'File deleted successfully from the database.',
                },
            };
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error Deleting File.' },
            };
        }
    }

    static async moveImageFile(id: string, folder: string) {
        try {
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
        } catch (error) {
            return {
                status: 500,
                data: { error: 'Error Moving File.' },
            };
        }
    }
}
