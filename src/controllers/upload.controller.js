import fs from 'fs'
import path from 'path'

export const uploadCategoryLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File tidak ditemukan'
    })
  }

  const fileUrl = `/uploads/categories/${req.file.filename}`

  res.json({
    success: true,
    data: {
      url: fileUrl
    }
  })
}

export const uploadBrandLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File tidak ditemukan'
    })
  }

  const fileUrl = `/uploads/brands/${req.file.filename}`

  res.json({
    success: true,
    data: {
      url: fileUrl
    }
  })
}

export const uploadProductImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File tidak ditemukan'
    })
  }

  const fileUrl = `/uploads/products/${req.file.filename}`  

  res.json({
    success: true,
    data: {
      url: fileUrl
    }
  })
}

export const uploadProductDocument = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File tidak ditemukan'
    })
  }

  const fileUrl = `/uploads/documents/${req.file.filename}`

  res.json({
    success: true,
    data: {
      url: fileUrl
    }
  })
}

export const deleteBrandImage = (req, res) => {
  const { uri } = req.body
  if(!uri) {
    return res.status(400).json({success: false})
  }

  const filePath = path.join(process.cwd(), '/public'+uri)
  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  res.json({success: true})
}


export const deleteCategoryImage = (req, res) => {
  const { uri } = req.body
  if(!uri) {
    return res.status(400).json({success: false})
  }

  const filePath = path.join(process.cwd(), '/public'+ uri)
  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  res.json({success: true})
}

export const deleteProductImage = (req, res) => {
  const { uri } = req.body
  if(!uri) {
    return res.status(400).json({success: false})
  }

  const filePath = path.join(process.cwd(),'/public/'+ uri)
  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  res.json({success: true})
}

export const deleteProductDocument = (req, res) => {
  const { uri } = req.body
  if(!uri) {
    return res.status(400).json({success: false})
  }
  const filePath = path.join(process.cwd(), '/public/'+uri)
  console.log(filePath)
  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  res.json({success: true})
}