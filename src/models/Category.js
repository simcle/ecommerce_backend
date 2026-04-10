// src/models/Category.js
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },

    level: {
      type: Number,
      default: 0
    },
    path: [
      {
        name: String,
        slug: String,
        _id: false
      }
    ],

    // ✅ logo untuk category utama
    logo: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

categorySchema.index({ parentId: 1 })
categorySchema.index({ slug: 1 }, { unique: true })

export default mongoose.model('Category', categorySchema)