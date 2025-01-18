import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
    name: string;
    path: string;
    size: number;
    folder: string | null;
    isFavourite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
    {
        name: { type: String, required: true, unique: true },
        path: { type: String, required: true },
        size: { type: Number, required: true },
        folder: { type: String, default: null },
        isFavourite: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default model<IImage>('Image', imageSchema);
