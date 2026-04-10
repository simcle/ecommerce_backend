import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // Tipe halaman: fixed + custom
    type: {
      type: String,
      enum: ['about', 'contact', 'privacy', 'terms', 'faq', 'custom'],
      required: true
    },

    // Konten HTML / Markdown (nanti bebas di frontend editor)
    content: {
      type: String,
      default: ''
    },

    // Deskripsi singkat (untuk teaser atau meta)
    excerpt: {
      type: String,
      default: ''
    },

    // Publish / Draft
    isPublished: {
      type: Boolean,
      default: false
    },
    isSystem: {
      type: Boolean,
      default: false
    },
    
    // SEO
    seoTitle: {
      type: String,
      default: ''
    },
    seoDescription: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

// Index buat akses cepat
pageSchema.index({ type: 1 })

export default mongoose.model('Page', pageSchema)