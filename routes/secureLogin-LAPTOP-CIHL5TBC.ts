// Avoid importing express types to prevent missing-typings errors in some setups
// Use any for request typing to keep compatibility without requiring @types/express
import {
    comparePassword,
    generateToken,
    validateAndSanitizeUserInput,
    checkBruteForce,
    recordFailedAttempt,
    resetBruteForce
} from '../utils/security';
import { UserModel } from '../models/user';

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
            }

            // Validate input
            const validation = validateAndSanitizeUserInput({ email, password });
            if (validation.errors.length > 0) {
                return (res as any).status(400).json({
                    message: 'Invalid input',
                    errors: validation.errors
                });
            }

            // Find user
            const user = await (UserModel as any).findOne({ where: { email } });
            if (!user) {
                recordFailedAttempt(ip);
                return (res as any).status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isValid = await comparePassword(password, user.password);
            if (!isValid) {
                recordFailedAttempt(ip);
                return (res as any).status(401).json({ message: 'Invalid credentials' });
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