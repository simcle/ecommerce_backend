// src/controllers/brand.controller.js
import * as BrandService from '../services/brand.service.js'

export const create = async (req, res, next) => {
  try {
    const data = await BrandService.createBrand(req.body)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const data = await BrandService.updateBrand(req.params.id, req.body)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const list = async (req, res, next) => {
  try {
    const data = await BrandService.getBrands()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const detail = async (req, res, next) => {
  try {
    const data = await BrandService.getBrandById(req.params.id)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}