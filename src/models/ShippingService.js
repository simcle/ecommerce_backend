import mongoose from "mongoose"

const shippingServiceSchema = new mongoose.Schema({

  courierCode: {
    type: String,
    required: true
  },

  courierName: {
    type: String,
    required: true
  },

  serviceCode: {
    type: String,
    required: true
  },

  serviceName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  serviceType: {
    type: String,
    default: ""
  },

  shippingType: {
    type: String,
    default: ""
  },

  shipmentDurationRange: {
    type: String,
    default: ""
  },

  shipmentDurationUnit: {
    type: String,
    default: ""
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true })

shippingServiceSchema.index(
  { courierCode: 1, serviceCode: 1 },
  { unique: true }
)

export default mongoose.model("ShippingService", shippingServiceSchema)