// src/models/Brand.js
import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      index: true
    },

    description: {
      type: String,
      trim: true
    },

    logo: {
      type: String, // URL logo
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Brand', brandSchema)