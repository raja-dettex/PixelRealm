import { Request, Response, NextFunction } from 'express';
import { authService } from '../index';

// Extend Express Request type to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const { isValid, id } = await authService.validateToken(token);
        if (!isValid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        req.userId = id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
};
