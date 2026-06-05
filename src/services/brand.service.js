// src/services/brand.service.js
import Brand from '../models/Brand.js'
import { generateBrandSlug } from '../utils/brandSlug.js'

export const createBrand = async ({ name, description, logo }) => {
  const slug = await generateBrandSlug(name)

  return Brand.create({
    name,
    slug,
    description,
    logo
  })
}

export const updateBrand = async (id, payload) => {
  const brand = await Brand.findById(id)
  if (!brand) throw new Error('Brand tidak ditemukan')

  // slug tidak boleh diubah manual
  delete payload.slug

  return Brand.findByIdAndUpdate(id, payload, { new: true })
}

export const getBrands = async ({
  page = 1,
  limit = 20,
  search = ''
}) => {
  page = Number(page)
  limit = Number(limit)

  const skip = (page - 1) * limit

  const filter = {
    isActive: true
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i'
    }
  }
  const [brands, total] = await Promise.all([
    Brand.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Brand.countDocuments(filter)
  ])

  return {
    data: brands,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const getBrandById = async (id) => {
  const brand = await Brand.findById(id)
  if (!brand) throw new Error('Brand tidak ditemukan')
  return brand
}