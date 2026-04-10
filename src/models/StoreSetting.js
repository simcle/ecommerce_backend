import mongoose from 'mongoose'

const storeSettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: ''
    },
    tagLine: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    mapLink: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    whatsapp: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    logo: {
      type: String, // simpan path file
      default: null
    }
  },
  { timestamps: true }
)

export default mongoose.model('StoreSetting', storeSettingSchema)