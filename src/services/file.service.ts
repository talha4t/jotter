import File from '../models/file.model';

interface FileData {
    name?: string;
    content?: string;
    folder?: string;
}

export default class FileService {
    static async createFile(data: FileData) {
        try {
            const { name, content, folder } = data;

            const existingFile = await File.findOne({ name });
            if (existingFile) {
                throw new Error('A file with this name already exists.');
            }

            const newFile = new File({ name, content, folder });
            await newFile.save();

            return { message: 'File created successfully.', data: newFile };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'File Created Error' },
            };
        }
    }

    static async listFiles() {
        try {
            const files = await File.find();
            return files;
        } catch (error) {
            return {
                status: 500,
                data: { message: 'Get File List Error' },
            };
        }
    }

    static async updateFile(id: string, data: FileData) {
        try {
            const { name, content, folder } = data;

            const file = await File.findById(id);
            if (!file) {
                throw new Error('File not found.');
            }

            if (name) {
                const existingFile = await File.findOne({ name });
                if (existingFile && existingFile.id !== id) {
                    throw new Error('A file with this name already exists.');
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

            return { message: 'File updated successfully.', data: file };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'File Update Error' },
            };
        }
    }

    static async toggleFavourite(id: string) {
        try {
            const file = await File.findById(id);
            if (!file) {
                throw new Error('File not found.');
            }

            file.isFavourite = !file.isFavourite;
            await file.save();

            return {
                message: file.isFavourite
                    ? 'File added to favourites.'
                    : 'File removed from favourites.',
                data: file,
            };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'File Favourite Error' },
            };
        }
    }

    static async deleteFile(id: string) {
        try {
            const file = await File.findById(id);
            if (!file) {
                throw new Error('File not found.');
            }

            await file.deleteOne();

            return { message: 'File deleted successfully.' };
        } catch (error) {
            return {
                status: 500,
                data: { message: 'File Delete Error' },
            };
        }
    }
}
