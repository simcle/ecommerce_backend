import SocialMedia from '../models/SocialMedia.js'

const defaultSocialMedia = [
  {
    name: 'Instagram',
    type: 'instagram',
    icon: 'ph-instagram-logo',
    url: 'https://www.instagram.com',
    order: 1
  },
  {
    name: 'Facebook',
    type: 'facebook',
    icon: 'ph-facebook-logo',
    url: 'https://web.facebook.com',
    order: 2
  },
  {
    name: 'TikTok',
    type: 'tiktok',
    icon: 'ph-tiktok-logo',
    url: 'https://www.tiktok.com',
    order: 3
  },
  {
    name: 'YouTube',
    type: 'youtube',
    icon: 'ph-youtube-logo',
    url: 'https://www.youtube.com',
    order: 4
  },
  {
    name: 'LinkedIn',
    type: 'linkedin',
    icon: 'ph-linkedin-logo',
    url: 'https://id.linkedin.com',
    order: 5
  },
  {
    name: 'Google Business',
    type: 'googelbusiness',
    icon: 'ph-google-logo',
    url: 'https://business.google.com',
    order: 6
  },
  {
    name: 'Twitter X',
    type: 'twitter',
    icon: 'ph-x-logo',
    url: 'https://x.com',
    order: 7
  },
]

export const initializeDefaultSocialMedia = async () => {
  for (const item of defaultSocialMedia) {

    const exists = await SocialMedia.findOne({ type: item.type })
    
    if (!exists) {
      await SocialMedia.create({
        ...item,
        isActive: false,
        isSystem: true
      })
    }
  }
}