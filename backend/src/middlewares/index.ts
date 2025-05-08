import express, { NextFunction, Request, Response } from "express"
import { get, merge } from "lodash"

import { getUserBySessionToken } from "../db/users"

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['FUTURE-BLINK']

        if (!sessionToken) {
            res.sendStatus(403)
            return
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            res.sendStatus(403)
            return
        }

        merge(req, { identity: existingUser });

        return next()

    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
}