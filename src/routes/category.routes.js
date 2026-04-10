// src/routes/category.routes.js
import express from 'express'
import * as CategoryController from '../controllers/category.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// public
router.get('/root', CategoryController.getRootCategories)
router.get('/breadcrumb/:id', CategoryController.breadcrumb)
router.get('/flat', CategoryController.getCategoryFlat)

// admin
router.get('/tree', CategoryController.tree)
router.post('/', auth, isAdmin, CategoryController.create)
router.put('/:id', auth, isAdmin, CategoryController.update)

export default router