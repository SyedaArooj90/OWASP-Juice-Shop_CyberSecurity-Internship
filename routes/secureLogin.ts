<<<<<<< HEAD
import { Request, Response } from 'express';
=======
// Avoid importing express types to prevent missing-typings errors in some setups
// Use any for request typing to keep compatibility without requiring @types/express
>>>>>>> 6d5f4f7efb4e0edc76e74942584788c28af9e8c6
import {
    comparePassword,
    generateToken,
    validateAndSanitizeUserInput,
    checkBruteForce,
    recordFailedAttempt,
    resetBruteForce
} from '../utils/security';
import { UserModel } from '../models/user';

<<<<<<< HEAD
export const secureLogin = () => {
    return async (req: Request, res: Response) => {
        console.log('🔥 secureLogin HIT');
        try {
            const { email, password } = req.body;
            const ip = req.ip || req.socket.remoteAddress || 'unknown';
            console.log('🔥 IP:', ip);

            // Block if this IP has too many recent failed attempts
            if (checkBruteForce(ip)) {
                return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
=======
declare const console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
};

export const secureLogin = () => {
    return async (req: any, res: any) => {
        console.log('🔥 secureLogin HIT');
        try {
            const { email, password } = (req as any).body as { email: string; password: string };
            const ip = (req as any).ip || (req as any).socket?.remoteAddress || 'unknown';
            console.log('🔥 IP:', ip);

            // Block if this IP has too many recent failed attempts
            if (checkBruteForce(ip)) {
                return (res as any).status(429).json({ message: 'Too many login attempts. Please try again later.' });
>>>>>>> 6d5f4f7efb4e0edc76e74942584788c28af9e8c6
            }

            // Validate input
            const validation = validateAndSanitizeUserInput({ email, password });
            if (validation.errors.length > 0) {
<<<<<<< HEAD
                return res.status(400).json({
=======
                return (res as any).status(400).json({
>>>>>>> 6d5f4f7efb4e0edc76e74942584788c28af9e8c6
                    message: 'Invalid input',
                    errors: validation.errors
                });
            }

            // Find user
<<<<<<< HEAD
            const user = await UserModel.findOne({ where: { email } });
            if (!user) {
                recordFailedAttempt(ip);
                return res.status(401).json({ message: 'Invalid credentials' });
=======
            const user = await (UserModel as any).findOne({ where: { email } });
            if (!user) {
                recordFailedAttempt(ip);
                return (res as any).status(401).json({ message: 'Invalid credentials' });
>>>>>>> 6d5f4f7efb4e0edc76e74942584788c28af9e8c6
            }

            // Check password
            const isValid = await comparePassword(password, user.password);
            if (!isValid) {
                recordFailedAttempt(ip);
<<<<<<< HEAD
                return res.status(401).json({ message: 'Invalid credentials' });
=======
                return (res as any).status(401).json({ message: 'Invalid credentials' });
>>>>>>> 6d5f4f7efb4e0edc76e74942584788c28af9e8c6
            }

            // Success — clear failed attempt history for this IP
            resetBruteForce(ip);

            const token = generateToken(user.id.toString());

            // Return in Juice Shop expected format
            res.json({
                authentication: {
                    token,
                    uid: user.id,
                    bid: null
                }
            });
        } catch (error) {
            console.error(error);
            (res as any).status(500).json({ message: 'Login failed' });
        }
    };
};