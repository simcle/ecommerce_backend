import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import * as StoreController from '../controllers/store.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// Ensure uploads folder exists
const uploadDir = path.resolve('public/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Allowed mime types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

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
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
})

router.get('/', auth, isAdmin, StoreController.getStore)

router.put(
  '/',
  auth,
  isAdmin,
  upload.single('logo'),
  StoreController.updateStore
)

// public
router.get('/public', StoreController.getStore)

export default router