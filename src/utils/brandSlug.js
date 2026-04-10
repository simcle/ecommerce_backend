import slugify from 'slugify'
import Brand from '../models/Brand.js'

export const generateBrandSlug = async (name) => {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  })

  let slug = baseSlug
  let counter = 1

  while (await Brand.exists({ slug })) {
    counter++
    slug = `${baseSlug}-${counter}`
  }

  return slug
}