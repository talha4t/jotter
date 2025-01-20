import * as path from 'path';
import * as fs from 'fs';

import { Request } from 'express';

import multer, { diskStorage } from 'multer';

export const multerOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../public/temp/pdfs');

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(
                null,
                `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
        },
    }),

    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback,
    ) => {
        const allowedMimeTypes = ['application/pdf'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error('Only PDF files are allowed!') as unknown as null,
                false,
            );
        }

        cb(null, true);
    },

    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};

export const uploadMiddleware = multer(multerOptions).single('pdf');
