import express from "express"

import authentication from "./authentication"
import sequence from "./sequence"
import email from "./email"
import test from "./test"

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    sequence(router)
    email(router)
    test(router)
    
    return router
}