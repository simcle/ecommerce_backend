import fs from 'fs'
import path from 'path'
import * as BannerService from '../services/banner.service.js'

// admin

export const getAdminBanners = async (req, res, next) => {
  try {
    const banners = await BannerService.getAllBanners()
    res.json(banners)
  } catch (err) {
    next(err)
  }
}

export const createBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('Image banner wajib diupload')
    }

    const payload = {
      title: req.body.title,
      description: req.body.description,
      targetUrl: req.body.targetUrl,
      isActive: req.body.isActive === 'true',
      image: `/uploads/banners/${req.file.filename}`
    }

    const banner = await BannerService.createBanner(payload)

    res.status(201).json(banner)
  } catch (err) {
    next(err)
  }
}

export const updateBanner = async (req, res, next) => {
  try {
    const existing = await BannerService.getAllBanners()
    const banner = existing.find(b => b._id.toString() === req.params.id)

    if (!banner) {
      throw new Error('Banner tidak ditemukan')
    }

    const payload = {
      title: req.body.title,
      description: req.body.description,
      targetUrl: req.body.targetUrl,
      isActive: req.body.isActive === 'true'
    }

    if (req.file) {
      // delete old image
      if (banner.image) {
        const oldPath = path.resolve(banner.image.replace(/^\//, 'public/'))
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      payload.image = `/uploads/banners/${req.file.filename}`
    }

    const updated = await BannerService.updateBanner(req.params.id, payload)

    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await BannerService.deleteBanner(req.params.id)

    if (banner?.image) {
      const filePath = path.resolve(banner.image.replace(/^\//, ''))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    res.json({ message: 'Banner berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}

// public
export const getPublicBanners = async (req, res, next) => {
  try {
    const banners = await BannerService.getPublicBanners()
    res.json(banners)
  } catch (err) {
    next(err)
  }
}