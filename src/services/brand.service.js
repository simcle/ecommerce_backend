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

export const getBrands = async () => {
  return Brand.find({ isActive: true }).sort({ createdAt: -1 })
}

export const getBrandById = async (id) => {
  const brand = await Brand.findById(id)
  if (!brand) throw new Error('Brand tidak ditemukan')
  return brand
}