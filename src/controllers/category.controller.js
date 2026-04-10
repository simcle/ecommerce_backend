// src/controllers/category.controller.js
import * as CategoryService from '../services/category.service.js'

export const create = async (req, res, next) => {
  try {
    const data = await CategoryService.createCategory(req.body)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const data = await CategoryService.updateCategory(
      req.params.id,
      req.body
    )
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const tree = async (req, res, next) => {
  try {
    const data = await CategoryService.getCategoryTree()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

// ecommerece

export const getRootCategories = async (req, res, next) => {
  try {
    const data = await CategoryService.getRootCategories()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const breadcrumb = async (req, res, next) => {
  try {

    const data = await CategoryService.getCategoryBreadcrumb(
      req.params.id
    )

    res.json({ success: true, data })

  } catch (err) {
    next(err)
  }
}

export const getCategoryFlat = async (req, res, next) => {
  try {
    const data = await CategoryService.getCategoryFlat()
    res.json(data)
  } catch (err) {
    next(err)
  }
}
 