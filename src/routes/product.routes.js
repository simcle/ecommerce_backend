// src/routes/product.routes.js
import express from 'express'
import {
  createProduct,
  getAdminList,
  getDetail,
  getLandingProducts,
  getProductBySlug,
  productsByCategory,
  relatedProducts,
  update,
  searchProducts,
  suggestProducts,
  getProductsByBrand
} from '../controllers/product.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// ==== ADMIN ROUTES ====
router.get('/admin', auth, isAdmin, getAdminList)
router.get('/admin/:id', auth, isAdmin, getDetail)
router.post('/admin', auth, isAdmin, createProduct)
router.put('/admin/:id', auth, isAdmin, update)

// ==== PUBLIC ROUTES (catalog) ====
router.get('/landing', getLandingProducts)
router.get("/search", searchProducts)
router.get("/suggest", suggestProducts)
router.get('/category/:slug', productsByCategory)
router.get('/brand/:slug', getProductsByBrand)
router.get('/:id/related', relatedProducts)
router.get('/:slug', getProductBySlug)

export default router