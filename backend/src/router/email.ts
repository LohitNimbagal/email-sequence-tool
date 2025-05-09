import express from "express"
import { sendAnEmail } from "../controllers/email";

export default (router: express.Router) => {

    router.post("/email/send", sendAnEmail)

};