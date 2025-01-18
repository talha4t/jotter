import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';

// Explicitly typing the middleware as RequestHandler
export const validate: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const errors = validationResult(req);

    // If validation errors are found, return a response with status 400
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    // Otherwise, continue processing the request
    next();
};
