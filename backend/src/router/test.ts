import express, { Request, Response } from "express"

import { register, } from "../controllers/authentication"

export default (router: express.Router) => {
    router.get('/test', async (req: Request, res: Response) => {
        res.status(200).json("Hello");
    })
}
