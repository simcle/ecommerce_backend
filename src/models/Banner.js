import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    targetUrl: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model('Banner', bannerSchema)