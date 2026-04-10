import mongoose from "mongoose"

const metricMapSchema = {
  type: Map,
  of: Number,
  default: {}
}

const pageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    views: { type: Number, default: 0 }
  },
  { _id: false }
)

const analyticsHourlySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },

    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
      index: true
    },

    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },

    devices: metricMapSchema,
    countries: metricMapSchema,
    sources: metricMapSchema,

    topPages: {
      type: [pageSchema],
      default: []
    },

    syncStatus: {
      type: String,
      enum: ["success", "partial", "failed"],
      default: "success"
    },

    syncedAt: {
      type: Date,
      default: Date.now
    },

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
)

analyticsHourlySchema.index({ date: 1, hour: 1 }, { unique: true })

export default mongoose.model("AnalyticsHourly", analyticsHourlySchema)