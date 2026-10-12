import { login, logout } from "../controllers/auth.controllers.js"
import express from 'express'

 const router = express.Router()
 router.post('/login',login)
 router.get('/logout',logout)

 export default router