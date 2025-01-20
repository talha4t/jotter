import { Schema, model, Document } from 'mongoose';

interface IFile extends Document {
    name: string;
    content: string;
    folder: string | null;
    isFavourite: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
    {
        name: { type: String, required: true, unique: true },
        content: { type: String, default: '' },
        folder: { type: String, default: null },
        isFavourite: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default model<IFile>('File', fileSchema);
