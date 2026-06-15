import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from './logger.js'; // your Week 3 configured Winston logger

interface UserInput {
    email?: string;
    password?: string;
    username?: string;
}

export const validateAndSanitizeUserInput = (userData: UserInput) => {
    const errors: string[] = [];

    if (!userData.email || !validator.isEmail(userData.email)) {
        errors.push('Valid email is required');
    }

    if (!userData.password || !validator.isStrongPassword(userData.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, number and symbol');
    }

    const sanitized = {
        email: userData.email ? validator.normalizeEmail(userData.email) : '',
        username: userData.username ? validator.escape(validator.trim(userData.username)) : '',
        password: userData.password
    };

    return { sanitized, errors };
};

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
        logger.warn('JWT_SECRET not set in environment — using insecure default. Set it in .env!');
    }
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'juice-shop-secret-key-2026',
        { expiresIn: '24h' }
    );
};

export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'juice-shop-secret-key-2026');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// ===========================
// Brute Force Detection
// ===========================
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const checkBruteForce = (ip: string): boolean => {
    const attempts = loginAttempts.get(ip);
    if (!attempts) return false;

    if (Date.now() - attempts.lastAttempt > WINDOW_MS) {
        loginAttempts.delete(ip);
        return false;
    }

    return attempts.count >= MAX_ATTEMPTS;
};

export const recordFailedAttempt = (ip: string): void => {
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

    if (now - attempts.lastAttempt > WINDOW_MS) {
        attempts.count = 0;
    }

    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(ip, attempts);

    if (attempts.count >= MAX_ATTEMPTS) {
        logger.warn(`🚨 Brute force attempt detected from IP: ${ip} (${attempts.count} failed attempts)`);
    }
};

export const resetBruteForce = (ip: string): void => {
    loginAttempts.delete(ip);
};