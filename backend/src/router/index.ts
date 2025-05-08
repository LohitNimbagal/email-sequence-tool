import express from "express"

import authentication from "./authentication"
import sequence from "./sequence"

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    sequence(router)

    return router
}