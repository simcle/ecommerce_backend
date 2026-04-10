import slugify from 'slugify'
import Page from '../models/Page.js'

export const generatePageSlug = async (title) => {
  // slug dasar
  let baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  })

  let slug = baseSlug
  let counter = 1

  // cek duplikat
  while (await Page.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}