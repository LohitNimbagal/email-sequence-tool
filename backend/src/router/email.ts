import express from "express"
import { sendAnEmail } from "../controllers/email";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {

    router.post("/email/send", isAuthenticated, sendAnEmail)

};