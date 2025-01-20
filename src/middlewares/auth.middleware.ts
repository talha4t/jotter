import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.util';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'You are Not Authorized' });

            return;
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });

        return;
    }
};
