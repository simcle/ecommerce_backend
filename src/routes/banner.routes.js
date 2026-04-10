import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import * as BannerController from '../controllers/banner.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// Ensure uploads folder exists
const uploadDir = path.resolve('public/uploads/banners')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const unique = crypto.randomBytes(16).toString('hex')
    cb(null, unique + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
})

/* =====================
   ADMIN ROUTE
===================== */

router.get('/admin', auth, isAdmin, BannerController.getAdminBanners)

router.post(
  '/admin',
  auth,
  isAdmin,
  upload.single('image'),
  BannerController.createBanner
)

router.put(
  '/admin/:id',
  auth,
  isAdmin,
  upload.single('image'),
  BannerController.updateBanner
)

router.delete(
  '/admin/:id',
  auth,
  isAdmin,
  BannerController.deleteBanner
)



// PUBLIC ROUTE

router.get('/', BannerController.getPublicBanners)

export default router