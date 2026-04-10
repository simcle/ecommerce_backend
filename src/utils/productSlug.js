import slugify from 'slugify'
import Product from '../models/Product.js'

export const generateProductSlug = async (name) => {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true, // hapus karakter aneh
    trim: true
  })

  let slug = baseSlug
  let counter = 1

  while (await Product.exists({ slug })) {
    counter++
    slug = `${baseSlug}-${counter}`
  }

  return slug
}