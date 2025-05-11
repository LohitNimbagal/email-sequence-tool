import express from "express"

import { login, register, getCurrentUser, logout } from "../controllers/authentication"
import { isAuthenticated } from "../middlewares"

export default (router: express.Router) => {
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.get('/auth/current', isAuthenticated, getCurrentUser)
    router.post('/auth/logout', isAuthenticated, logout)
}
