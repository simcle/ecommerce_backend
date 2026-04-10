import multer from 'multer'
import path from 'path'
import fs from 'fs'

// helper ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
// ===============================
// Category logo storage
// ===============================
export const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/categories'
    ensureDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `category-${Date.now()}${ext}`
    cb(null, filename)
  }
})

// ===============================
// Brand logo storage
// ===============================
export const brandStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/brands'
    ensureDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `brand-${Date.now()}${ext}`
    cb(null, filename)
  }
})

// ===============================
// Product images storage
// ===============================
export const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/products'
    ensureDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `product-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`
    cb(null, filename)
  }
})
// ===============================
// Product document storage
// ===============================
export const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/documents'
    ensureDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `document-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`
    cb(null, filename)
  }
})

export const uploadDocument = multer({
  storage: documentStorage
})

// ===============================
// Shared image filter
// ===============================
export const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('File harus berupa image'), false)
  }
  cb(null, true)
}

export const uploadCategoryLogo = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
})

export const uploadBrandLogo = multer({
  storage: brandStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
})

export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB per image
  }
})

