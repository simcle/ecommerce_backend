import express from 'express'
import {
  uploadCategoryLogo as uploadCategory,
  uploadBrandLogo as uploadBrand,
  uploadProductImage,
  uploadDocument
} from '../config/multer.js'

import {
  uploadCategoryLogo,
  uploadBrandLogo,
  uploadProductImage as uploadProductImagesController,
  uploadProductDocument,
  deleteProductImage,
  deleteCategoryImage,
  deleteBrandImage,
  deleteProductDocument
} from '../controllers/upload.controller.js'

import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// category logo
router.post(
  '/category-logo',
  auth,
  isAdmin,
  uploadCategory.single('logo'),
  uploadCategoryLogo
)

router.delete(
  '/category-logo',
  auth,
  isAdmin,
  deleteCategoryImage
)

// brand logo
router.post(
  '/brand-logo',
  auth,
  isAdmin,
  uploadBrand.single('logo'),
  uploadBrandLogo
)

router.delete(
  '/brand-logo',
  auth,
  isAdmin,
  deleteBrandImage
)

// product image
router.post(
  '/product-image',
  auth,
  isAdmin,
  uploadProductImage.single('image'),
  uploadProductImagesController
)

router.delete(
  '/product-image',
  auth,
  isAdmin,
  deleteProductImage
)

// document product
router.post(
  '/product-document',
  auth,
  isAdmin,
  uploadDocument.single('file'),
  uploadProductDocument
)

router.delete(
  '/product-document',
  auth,
  isAdmin,
  deleteProductDocument
)
export default router