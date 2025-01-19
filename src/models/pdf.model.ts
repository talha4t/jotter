import { Schema, model, Document } from 'mongoose';

interface IPdf extends Document {
    name: string;
    path: string;
    size: number;
    folder: string | null;
    isFavourite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const pdfSchema = new Schema<IPdf>(
    {
        name: { type: String, required: true, unique: true },
        path: { type: String, required: true },
        size: { type: Number, required: true },
        folder: { type: String, default: null },
        isFavourite: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default model<IPdf>('Pdf', pdfSchema);
