import mongoose from 'mongoose'

const socialMediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        'instagram',
        'facebook',
        'twitter',
        'tiktok',
        'youtube',
        'linkedin',
        'whatsapp',
        'telegram',
        'googelbusiness',
        'custom'
      ],
      required: true
    },

    url: {
      type: String,
      required: true
    },

    icon: {
      type: String, // contoh: "ph-instagram-logo"
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isSystem: {
      type: Boolean,
      default: false
    },

    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model('SocialMedia', socialMediaSchema)