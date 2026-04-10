// src/models/Product.js
import mongoose from 'mongoose'

/*
|--------------------------------------------------------------------------
| Sale Schema
|--------------------------------------------------------------------------
*/
const saleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['regular', 'preorder'],
      default: 'regular'
    },
    preOrderDays: {
      type: Number,
      default: null
    }
  },
  { _id: false }
)

/*
|--------------------------------------------------------------------------
| Variant Schema
|--------------------------------------------------------------------------
*/
const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },

    attributes: {
      type: Map,
      of: String,          // dynamic attribute key-value
      required: true
    },

    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },

    image: { type: String },

    sale: {
      type: saleSchema,
      default: () => ({})
    },

    isActive: { type: Boolean, default: true }
  },
  { _id: false }
)

const specificationItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    value: {
      type: String,
      trim: true
    }
  },
  { _id: false }
)

const documentItemSchema = new mongoose.Schema(
{
  name: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  }
},
{ _id: false }
)

/*
|--------------------------------------------------------------------------
| Product Schema
|--------------------------------------------------------------------------
*/
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },

    description: String,

    images: {
      type: [String],
      default: []
    },

    condition: {
      type: String,
      enum: ['new', 'used'],
      default: 'new'
    },

    /*
    |--------------------------------------------------------------------------
    | Single Product Mode (No Variant)
    |--------------------------------------------------------------------------
    */
    hasVariant: {
      type: Boolean,
      default: false
    },

    sku: {
      type: String,
      required: function () {
        return !this.hasVariant
      }
    },

    price: {
      type: Number,
      required: function () {
        return !this.hasVariant
      }
    },

    purchaseLimit: {
      type: Number,
      default: null
    },

    stock: {
      type: Number,
      default: 0
    },

    weight: {
      type: Number,
      default: 0
    },

    sale: {
      type: saleSchema,
      default: () => ({})
    },


    /*
    |--------------------------------------------------------------------------
    | Variant Mode
    |--------------------------------------------------------------------------
    */
    variants: {
      type: [variantSchema],
      default: []
    },

    /*
    =========================
    SPECIFICATIONS
    =========================
    */

    specifications: {
      enabled: {
        type: Boolean,
        default: false
      },

      items: {
        type: [specificationItemSchema],
        default: []
      }
    },

    /*
    |--------------------------------------------------------------------------
    | DOCUMENTS FILE
    |--------------------------------------------------------------------------
    */

    documents: {
      enabled: {
        type: Boolean,
        default: false
      },

      items: {
        type: [documentItemSchema],
        default: []
      }
    },

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    */
    shipping: {
      weight: Number,
      height: Number,
      width: Number,
      length: Number,
      insurance: {
        type: String,
        enum: ['optional', 'must'],
        default: 'optional'
      }
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'inactive', 'archived'],
      default: 'draft',
      index: true
    }
  },
  { timestamps: true }
)
productSchema.index(
  {
    name: "text",
    "variants.sku": "text"
  },
  {
    weights: {
      name: 10,
      "variants.sku": 5
    }
  }
)
productSchema.index({ createdAt: -1 })
productSchema.index({ brandId: 1 })
export default mongoose.model('Product', productSchema)