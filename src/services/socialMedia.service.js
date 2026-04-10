import SocialMedia from '../models/SocialMedia.js'

export const getAdminSocialMedia = async () => {
  return SocialMedia.find().sort({ order: 1 })
}

export const getActiveSocialMedia = async () => {
  return SocialMedia.find({ isActive: true })
    .sort({ order: 1 })
    .select('name url icon type')
}

export const createSocialMedia = async (payload) => {
  return SocialMedia.create(payload)
}

export const updateSocialMedia = async (id, payload) => {
  return SocialMedia.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteSocialMedia = async (id) => {
  return SocialMedia.findByIdAndDelete(id)
}