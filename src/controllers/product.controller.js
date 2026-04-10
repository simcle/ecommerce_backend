// src/controllers/product.controller.js
import * as ProductService from '../services/product.service.js'

export const getAdminList = async (req, res , next) => {
  try {
    const result = await ProductService.getAdminProducts(req.query)
    res.json({
      success: true,
      ...result
    })
  } catch (err) {
    next(err)
  }
}

export const getDetail = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id)
    res.json({
      success: true,
      data: product
    })
  } catch (err) {
    next (err)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const data = await ProductService.createProduct(req.body)
    res.status(201).json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {

    const updated = await ProductService.updateProduct(
      req.params.id,
      req.body
    )

    res.json({
      success: true,
      data: updated
    })

  } catch (err) {
    next(err)
  }
}

// public

export const getLandingProducts = async (req, res, next) => {
  try {
    const data = await ProductService.getLandingProducts()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug)

    res.json({
      success: true,
      data: product
    })
  } catch (err) {
    next(err)
  }
}

export const relatedProducts = async (req, res, next) => {
  try {

    const { id } = req.params
    const { categoryId } = req.query

    const data = await ProductService.getRelatedProducts(
      id,
      categoryId
    )

    res.json(data)

  } catch (err) {
    next(err)
  }
}

export const productsByCategory = async (req, res, next) => {

  try {

    const { slug } = req.params
    const {
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
    } = req.query
    let brands = req.query["brands[]"] || []
    if(!Array.isArray(brands)) {
      brands = [brands]
    }

    const data = await ProductService.getProductsByCategory(slug, {
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      brands
    })

    res.json(data)

  } catch (err) {
    next(err)
  }

}

export const getProductsByBrand = async (req, res, next) => {
  try {
    const slug = req.params.slug
    const {
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
    } = req.query
    const data = await ProductService.getProductsByBrand(slug, {
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
    })
    res.json(data)

  } catch (err) {
    next(err)
  }
}

export const searchProducts = async (req, res, next) => {
  try {
    const {
      q,
      page,
      limit,
      sort,
      minPrice,
      maxPrice
    } = req.query
    let brands = req.query["brands[]"] || []

    if (!Array.isArray(brands)) {
      brands = [brands]
    }

    const data = await ProductService.searchProducts({
      keyword: q,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      sort,
      minPrice,
      maxPrice,
      brands
    })

    res.json(data)

  } catch (err) {
    next(err)
  }
}

export const suggestProducts = async (req, res, next) => {
  try {

    const { q } = req.query

    if (!q) return res.json([])

    const data = await ProductService.suggestProducts(q)

    res.json(data)

  } catch (err) {
    next(err)
  }
}