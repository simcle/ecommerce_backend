import mongoose from "mongoose"

const seoMetaSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["home", "product", "category", "page", "search"],
      required: true,
      index: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },

    routeKey: {
      type: String,
      default: null,
      index: true
    },

    title: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    keywords: {
      type: [String],
      default: []
    },

    canonicalUrl: {
      type: String,
      default: ""
    },

    ogTitle: {
      type: String,
      default: ""
    },

    ogDescription: {
      type: String,
      default: ""
    },

    ogImage: {
      type: String,
      default: ""
    },

    ogType: {
      type: String,
      default: "website"
    },

    twitterCard: {
      type: String,
      default: "summary_large_image"
    },

    robots: {
      type: String,
      default: "index,follow"
    },

    structuredData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

seoMetaSchema.index(
  { entityType: 1, entityId: 1, routeKey: 1 },
  { unique: true }
)

export default mongoose.model("SeoMeta", seoMetaSchema)