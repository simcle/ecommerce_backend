import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Brand from '../models/Brand.js'
import { generateProductSlug } from '../utils/productSlug.js'
import { generateSKU } from '../utils/generateSKU.js'
import { getChildrenIds } from './category.service.js'

export const getAdminProducts = async (query) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    status = 'all',
    categoryId,
    brandId,
  } = query
  
  const skip = (Number(page) - 1) * Number(limit)
  const filter = {}

  // STATUS FILTER
  if( status !== 'all') {
    filter.status = status
  }

  // CATEGORY FILTER
  if (categoryId) {
    filter.categoryId = categoryId
  }

  // BRAND FILTER
  if (brandId) {
    filter.brandId = brandId
  }

  // SEARCH
  const trimmedSearch = search.trim()
  const isSearching = !!trimmedSearch
  let useTextSearch = false

  if (isSearching) {
    // Deteksi: ini kayak SKU bukan? (tanpa spasi, hanya huruf/angka/dash)
    const isLikelySku =
      !trimmedSearch.includes(' ') &&
      /[0-9]/.test(trimmedSearch)

    if (isLikelySku) {
      // Cari berdasarkan SKU (product.sku atau variants.sku)
      filter.$or = [
        { sku: { $regex: trimmedSearch, $options: 'i' } },
        { 'variants.sku': { $regex: trimmedSearch, $options: 'i' } }
      ]
    } else {
      // Cari berdasarkan nama produk (text index di name)
      filter.$text = { $search: trimmedSearch }
      useTextSearch = true
    }
  }

  // SORT
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    stock_high: { totalStock: -1 },
    stock_low: { totalStock: 1 },
    price_high: { displayPrice: -1 },
    price_low: { displayPrice: 1 }
  }

  let sortOption = sortMap[query.sort] || { createdAt: -1 }

  if (query.sort) {
    sortOption = sortMap[query.sort]
  } 
  else if (useTextSearch) {
    sortOption = { score: { $meta: 'textScore' } }
  }
  else {
    sortOption = { createdAt: -1 }
  }
  
  const pipeline = [
    { $match: filter },

    // Hitung field virtual untuk sorting
    {
      $addFields: {
        displayPrice: {
          $cond: [
            '$hasVariant',
            { $min: '$variants.price' },
            '$price'
          ]
        },
        totalStock: {
          $cond: [
            '$hasVariant',
            { $sum: '$variants.stock' },
            '$stock'
          ]
        },
        ...(useTextSearch ? { score: { $meta: 'textScore' } } : {})
      }
    },

    { $sort: sortOption },

    { $skip: skip },
    { $limit: Number(limit) }
  ]


  const [products, total, counts] = await Promise.all([
    Product.aggregate(pipeline),

    Product.countDocuments(filter),
    Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: {$sum: 1}
        }
      }
    ])
  ])

  const formattedCounts = {
    all: 0,
    published: 0,
    draft: 0,
    inactive: 0,
    archived: 0
  }
  counts.forEach(c => {
    formattedCounts[c._id] = c.count
    formattedCounts.all += c.count
  })
  return {
    data: products,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    },
    status: formattedCounts
  }
}

export const getProductById = async (id) => {
  const product = await Product.findById(id)
  if (!product) {
    throw new Error('Produk tidak ditemukan')
  }
  return product
}

export const createProduct = async (payload) => {
  const { 
    hasVariant,
    variants = [],
    sku,
    ...rest
  } = payload

  const slug = await generateProductSlug(rest.name)

  // CLEAN SPECIFICATIONS
  if (payload.specifications) {

    const { enabled, items = [] } = payload.specifications

    const cleanItems = items.filter(
      i => i.name?.trim() && i.value?.trim()
    )

    payload.specifications = {
      enabled: enabled && cleanItems.length > 0,
      items: cleanItems
    }

  }

  const productData = {
    ...rest,
    slug,
    hasVariant
  }

  /*
  |--------------------------------------------------------------------------
  | SINGLE MODE
  |--------------------------------------------------------------------------
  */
  if (!hasVariant) {

    productData.sku = sku
      ? sku
      : await generateSKU('PRD')

  }

  /*
  |--------------------------------------------------------------------------
  | VARIANT MODE
  |--------------------------------------------------------------------------
  */
  if (hasVariant) {

    productData.variants = await Promise.all(
      variants.map(async (variant) => {

        return {
          ...variant,
          sku: variant.sku
            ? variant.sku
            : await generateSKU('VAR')
        }

      })
    )
  }

  const product = await Product.create(productData)

  return product

} 


export const updateProduct = async (id, payload) => {
  const product = await Product.findById(id)

  if (!product) {
    throw new Error('Produk tidak ditemukan')
  }

  /*
  |--------------------------------------------------------------------------
  | BASIC FIELD UPDATE
  |--------------------------------------------------------------------------
  */
  product.name = payload.name
  product.brandId = payload.brandId
  product.categoryId = payload.categoryId
  product.description = payload.description
  product.images = payload.images || []
  product.shipping = payload.shipping || {}
  product.specifications = {
    enabled: payload.specifications?.enabled ?? false,
    items: (payload.specifications?.items || []).filter(
      i => i.name?.trim() && i.value?.trim()
    )
  }
  product.documents = {
    enabled: payload.documents?.enabled ?? false,
    items: (payload.documents?.items || []).filter(
      i => i.name?.trim()
    )
  }
  product.status = payload.status ?? product.status
  product.purchaseLimit = payload.purchaseLimit ?? null

  /*
  |--------------------------------------------------------------------------
  | SINGLE MODE
  |--------------------------------------------------------------------------
  */
  if (!payload.hasVariant) {

    product.hasVariant = false

    product.sku = payload.sku || product.sku
    product.price = payload.price
    product.stock = payload.stock ?? 0
    product.weight = payload.weight ?? 0
    product.sale = payload.sale || { type: 'regular', preOrderDays: null }

    product.variants = [] // 🔥 clear variant lama
  }

  /*
  |--------------------------------------------------------------------------
  | VARIANT MODE
  |--------------------------------------------------------------------------
  */
  if (payload.hasVariant) {

    product.hasVariant = true

    product.sku = undefined
    product.price = undefined

    product.variants = payload.variants.map(v => ({
      sku: v.sku,
      attributes: v.attributes,
      price: v.price,
      stock: v.stock ?? 0,
      weight: v.weight ?? 0,
      image: v.image || null,
      sale: v.sale || { type: 'regular', preOrderDays: null }
    }))
  }

  await product.save()

  return product
}


// public ecommerce

// landing page
export const getLandingProducts = async () => {
  const pipeline = [
    {
      $match: {
        status: 'published'
      }
    },
    {
      $addFields: {
        displayPrice: {
          $cond: [
            '$hasVariant',
            {$min: '$variants.price'},
            '$price'
          ]
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        image: { $arrayElemAt: ['$images', 0] },
        displayPrice: 1,
        createdAt: 1
      }
    },
    {$sort: {createdAt: -1}},
    {$limit: 24},
  ]
  return Product.aggregate(pipeline)
}

export const getProductBySlug = async (slug) => {

  const product = await Product.findOne({
    slug,
    status: 'published'
  })
  .populate('brandId', 'name')
  .populate({
    path: 'categoryId',
    select: 'name slug path'
  })
  .lean()

  if (!product) {
    throw new Error('Produk tidak ditemukan')
  }

  return product
}

export const getRelatedProducts = async (productId, categoryId, limit = 12) => {

  const products = await Product.aggregate([
    {
      $match: {
        categoryId: new mongoose.Types.ObjectId(categoryId),
        _id: { $ne: new mongoose.Types.ObjectId(productId) },
        status: 'published'
      }
    },
    
    {
      $sample: { size: limit }   // random
    },
    {
      $addFields: {
        displayPrice: {
          $cond: [
            '$hasVariant',
            {$min: '$variants.price'},
            '$price'
          ]
        }
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        displayPrice: 1,
        image: { $arrayElemAt: ["$images", 0] }
      }
    }
  ])

  return products
}

export const getProductsByCategory = async (
  slug,
  {
    page = 1,
    limit = 20,
    sort = "newest",
    minPrice,
    maxPrice,
    brands
  }
) => {

  const category = await Category.findOne({ slug }).lean()

  if (!category) throw new Error("Category tidak ditemukan")

  const categoryIds = await getChildrenIds(category._id)

  const brandId = brands.map(id => new mongoose.Types.ObjectId(id))

  const baseMatch = {
    categoryId: { $in: categoryIds },
    status: 'published'
  }

  if(brandId.length) {
    baseMatch.brandId = {$in: brandId}
  }

  let sortOption = { createdAt: -1 }

  if (sort === "price_asc") sortOption = { displayPrice: 1 }
  if (sort === "price_desc") sortOption = { displayPrice: -1 }

  const priceMatch = {}
  if(minPrice) priceMatch.$gte = Number(minPrice)
  if(maxPrice) priceMatch.$lte = Number(maxPrice)

  const skip = (page - 1) * limit

  const pipeline = [
    {$match: baseMatch},
    {
      $addFields: {
         displayPrice: {
            $cond: [
              '$hasVariant',
              {$min: '$variants.price'},
              '$price'
            ]
          }
      }
    }
  ]

  if (Object.keys(priceMatch).length) {
    pipeline.push({
      $match: { displayPrice: priceMatch }
    })
  }

  pipeline.push(
    { $sort: sortOption },
    { $skip: skip },
    { $limit: Number(limit) },

    {
      $project: {
        name: 1,
        slug: 1,
        displayPrice: 1,
        image: { $arrayElemAt: ["$images", 0] }
      }
    }
  )

  const [products, totalResult] = await Promise.all([
    Product.aggregate(pipeline),

    Product.aggregate([
      { $match: baseMatch },

      {
        $addFields: {
          displayPrice: {
            $cond: [
              "$hasVariant",
              { $min: "$variants.price" },
              "$price"
            ]
          }
        }
      },

      ...(Object.keys(priceMatch).length
        ? [{ $match: { displayPrice: priceMatch } }]
        : []),

      { $count: "total" }
    ])

  ])
  
  const total = totalResult[0]?.total || 0

  const totalPages = Math.ceil(total / limit)

  return {
    category,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    products
  }
}

export const getProductsByBrand = async (
  slug,
  {
    page = 1,
    limit = 20,
    sort = "newest",
    minPrice,
    maxPrice
  }
) => {

  page = Number(page)
  limit = Number(limit)

  const brand = await Brand.findOne({ slug }).lean()

  if (!brand) throw new Error("Merk tidak ditemukan")

  const match = {
    brandId: brand._id,
    status: "published"
  }

  const priceFilter = {}

  if (minPrice) priceFilter.$gte = Number(minPrice)
  if (maxPrice) priceFilter.$lte = Number(maxPrice)

  const pipeline = [

    {
      $match: match
    },

    {
      $addFields: {
        displayPrice: {
          $cond: [
            "$hasVariant",
            { $min: "$variants.price" },
            "$price"
          ]
        }
      }
    }

  ]

  if (Object.keys(priceFilter).length) {
    pipeline.push({
      $match: {
        displayPrice: priceFilter
      }
    })
  }

  if (sort === "price_asc") {
    pipeline.push({ $sort: { displayPrice: 1 } })
  }

  if (sort === "price_desc") {
    pipeline.push({ $sort: { displayPrice: -1 } })
  }

  if (sort === "newest") {
    pipeline.push({ $sort: { createdAt: -1 } })
  }

  const skip = (page - 1) * limit

  pipeline.push(
    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        name: 1,
        slug: 1,
        displayPrice: 1,
        image: { $arrayElemAt: ["$images", 0] }
      }
    }
  )

  const products = await Product.aggregate(pipeline)

  // total dengan pipeline yang sama
  const totalPipeline = [
    { $match: match },
    {
      $addFields: {
        displayPrice: {
          $cond: [
            "$hasVariant",
            { $min: "$variants.price" },
            "$price"
          ]
        }
      }
    }
  ]

  if (Object.keys(priceFilter).length) {
    totalPipeline.push({
      $match: { displayPrice: priceFilter }
    })
  }

  totalPipeline.push({ $count: "total" })

  const totalResult = await Product.aggregate(totalPipeline)

  const total = totalResult[0]?.total || 0

  return {
    brand,
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }

}

export const searchProducts = async ({
  keyword,
  page = 1,
  limit = 20,
  sort = "relevance",
  minPrice,
  maxPrice,
  brands
}) => {

  const skip = (page - 1) * limit

  const brandId = brands.map(id => new mongoose.Types.ObjectId(id))

  const match = {
    status: "published"
  }

  if (brandId.length) {
    match.brandId = { $in: brandId }
  }

  const priceFilter = {}

  if (minPrice) priceFilter.$gte = Number(minPrice)
  if (maxPrice) priceFilter.$lte = Number(maxPrice)

  const pipeline = [

    {
      $match: {
        ...match,
        $text: { $search: keyword }
      }
    },

    {
      $addFields: {
        score: { $meta: "textScore" },
        displayPrice: {
          $cond: [
            "$hasVariant",
            { $min: "$variants.price" },
            "$price"
          ]
        }
      }
    }

  ]

  if (Object.keys(priceFilter).length) {
    pipeline.push({
      $match: {
        displayPrice: priceFilter
      }
    })
  }

  if (sort === "relevance") {
    pipeline.push({ $sort: { score: -1 } })
  }

  if (sort === "price_asc") {
    pipeline.push({ $sort: { displayPrice: 1 } })
  }

  if (sort === "price_desc") {
    pipeline.push({ $sort: { displayPrice: -1 } })
  }

  if (sort === "newest") {
    pipeline.push({ $sort: { createdAt: -1 } })
  }

  pipeline.push(
    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        name: 1,
        slug: 1,
        displayPrice: 1,
        image: { $arrayElemAt: ["$images", 0] }
      }
    }
  )

  const products = await Product.aggregate(pipeline)

  const total = await Product.countDocuments({
    status: "published",
    $text: { $search: keyword }
  })

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const suggestProducts = async (keyword) => {

  return Product.find(
    {
      name: { $regex: keyword, $options: "i" },
      status: "published"
    },
    {
      name: 1,
      slug: 1
    }
  )
  .limit(10)
}