import Banner from '../models/Banner.js'

export const getAllBanners = async () => {
  return Banner.find().sort({ order: 1, createdAt: -1 })
}

export const createBanner = async (payload) => {
  return Banner.create(payload)
}

export const updateBanner = async (id, payload) => {
  return Banner.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteBanner = async (id) => {
  return Banner.findByIdAndDelete(id)
}

// Public
export const getPublicBanners = async () => {
  return Banner.find({
    isActive: true
  })
  .sort({ order: 1 })
  .select('title image targetUrl description')
}