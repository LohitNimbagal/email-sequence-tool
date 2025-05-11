import { Request, Response } from "express";
import { authentication, random } from "../helpers";
import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.sendStatus(400);
            return;
        }

        const user = await getUserByEmail(email)?.select('+authentication.salt +authentication.password');

        if (!user || !user.authentication?.salt || !user.authentication?.password) {
            res.sendStatus(400);
            return;
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            res.sendStatus(403);
            return;
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('FUTURE-BLINK', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.sendStatus(400);
            return;
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            res.sendStatus(400);
            return;
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['FUTURE-BLINK']

        if (!sessionToken) {
            res.status(401).json({ message: 'No session token provided' });
            return
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            res.status(403).json({ message: 'Invalid session token' });
            return
        }

        res.status(200).json(existingUser).end();
        return
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error getting current user' }).end();
        return
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Clear the session token
        res.clearCookie('FUTURE-BLINK');
        
        res.status(200).json({ message: "Logged out successfully" });
        return
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Error logging out" });
    }
};