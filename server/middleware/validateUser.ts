import { Request, Response, NextFunction } from 'express';

export const validateUserInput = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }
    
    next();
};