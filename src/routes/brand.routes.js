// src/routes/brand.routes.js
import express from 'express'
import * as BrandController from '../controllers/brand.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// public
router.get('/', BrandController.list)
router.get('/:id', BrandController.detail)

// admin
router.post('/', auth, isAdmin, BrandController.create)
router.put('/:id', auth, isAdmin, BrandController.update)

export default router