import fs from 'fs'
import path from 'path'
import * as StoreService from '../services/store.service.js'

export const getStore = async (req, res, next) => {
  try {
    const store = await StoreService.getStoreSetting()
    res.json(store)
  } catch (err) {
    next(err)
  }
}

export const updateStore = async (req, res, next) => {
    try {
        const existing = await StoreService.getStoreSetting()
        const payload = {
            name: req.body.name,
            tagLine: req.body.tagLine,
            description: req.body.description,
            address: req.body.address,
            mapLink: req.body.mapLink,
            phone: req.body.phone,
            whatsapp: req.body.whatsapp,
            website: req.body.website,
            email: req.body.email
        }
    if (req.file) {
      // delete old logo
      if (existing.logo) {
        const oldPath = path.resolve(existing.logo.replace(/^\//, 'public/'))
        console.log(oldPath)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      payload.logo = `/uploads/${req.file.filename}`
    }

    const store = await StoreService.updateStoreSetting(payload)

    res.json(store)
  } catch (err) {
    next(err)
  }
}