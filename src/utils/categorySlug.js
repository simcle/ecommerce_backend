import slugify from 'slugify'
import Category from '../models/Category.js'

export const generateCategorySlug = async (name) => {
  let baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  })

  let slug = baseSlug
  let counter = 1

  while (await Category.exists({ slug })) {
    counter++
    slug = `${baseSlug}-${counter}`
  }

  return slug
}