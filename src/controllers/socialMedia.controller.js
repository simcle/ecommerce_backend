import * as SocialMediaService from '../services/socialMedia.service.js'

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

export const getAdminSocialMedia = async (req, res, next) => {
  try {
    const data = await SocialMediaService.getAdminSocialMedia()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const createSocialMedia = async (req, res, next) => {
  try {
    const data = await SocialMediaService.createSocialMedia(req.body)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const updateSocialMedia = async (req, res, next) => {
  try {
    const data = await SocialMediaService.updateSocialMedia(
      req.params.id,
      req.body
    )
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const deleteSocialMedia = async (req, res, next) => {
  try {
    await SocialMediaService.deleteSocialMedia(req.params.id)
    res.json({ message: 'Social media berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

export const getPublicSocialMedia = async (req, res, next) => {
  try {
    const data = await SocialMediaService.getActiveSocialMedia()
    res.json(data)
  } catch (err) {
    next(err)
  }
}