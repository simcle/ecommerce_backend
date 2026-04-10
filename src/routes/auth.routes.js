// src/routes/auth.routes.js
import express from 'express'
import * as AuthController from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me', auth, AuthController.getMe)
router.put('/', auth, AuthController.updateUser)

export default router