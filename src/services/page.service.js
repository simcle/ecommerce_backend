import Page from '../models/Page.js'
import { generatePageSlug } from '../utils/generatePageSlug.js'

const FIXED_TYPES = ['about', 'contact', 'privacy', 'terms', 'faq']

/*
|--------------------------------------------------------------------------
| Admin List Pages (dengan filter & pagination)
|--------------------------------------------------------------------------
*/
export const getAdminPages = async (query) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    type = 'all',
    status = 'all'  // 'all' | 'published' | 'draft'
  } = query

  const skip = (Number(page) - 1) * Number(limit)
  const filter = {}

  // Filter type
  if (type !== 'all') {
    filter.type = type
  }

  // Filter status
  if (status === 'published') {
    filter.isPublished = true
  } else if (status === 'draft') {
    filter.isPublished = false
  }

  // Search di title
  const trimmed = search.trim()
  if (trimmed) {
    filter.title = { $regex: trimmed, $options: 'i' }
  }

  const [pages, total] = await Promise.all([
    Page.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Page.countDocuments(filter)
  ])

  return {
    data: pages,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  }
}

/*
|--------------------------------------------------------------------------
| Get Page by ID (Admin)
|--------------------------------------------------------------------------
*/
export const getPageById = async (id) => {
  const page = await Page.findById(id)
  if (!page) {
    throw new Error('Halaman tidak ditemukan')
  }
  return page
}

/*
|--------------------------------------------------------------------------
| Create Page
|--------------------------------------------------------------------------
*/
export const createPage = async (payload) => {
  const {
    title,
    type,
    content,
    excerpt,
    isPublished,
    seoTitle,
    seoDescription
  } = payload

  const finalSlug = await generatePageSlug(title)
  
  if (!title) {
    throw new Error('Judul halaman wajib diisi')
  }

  if (!type) {
    throw new Error('Tipe halaman wajib diisi')
  }

  // Validasi type fixed
  if (!['about', 'contact', 'privacy', 'terms', 'faq', 'custom'].includes(type)) {
    throw new Error('Tipe halaman tidak valid')
  }

  // Untuk type fixed (about, contact, dst) → hanya boleh 1 record per type
  if (FIXED_TYPES.includes(type)) {
    const exist = await Page.findOne({ type })
    if (exist) {
      throw new Error(`Halaman dengan tipe "${type}" sudah ada`)
    }
  }

  // Pastikan slug unik
  const existSlug = await Page.findOne({ finalSlug })
  if (existSlug) {
    throw new Error('Slug sudah digunakan halaman lain')
  }

  const page = await Page.create({
    title,
    slug: finalSlug,
    type,
    content: content || '',
    excerpt: excerpt || '',
    isPublished: !!isPublished,
    seoTitle: seoTitle || '',
    seoDescription: seoDescription || ''
  })

  return page
}

/*
|--------------------------------------------------------------------------
| Update Page
|--------------------------------------------------------------------------
*/
export const updatePage = async (id, payload) => {
  const page = await Page.findById(id)
  if (!page) {
    throw new Error('Halaman tidak ditemukan')
  }

  // Tipe tidak boleh diubah (lebih aman)
  if (payload.type && payload.type !== page.type) {
    throw new Error('Tipe halaman tidak boleh diubah')
  }

  // Kalau slug diubah → cek unik
  if (payload.slug && payload.slug !== page.slug) {
    const existSlug = await Page.findOne({ slug: payload.slug })
    if (existSlug) {
      throw new Error('Slug sudah digunakan halaman lain')
    }
    page.slug = payload.slug
  }

  page.title = payload.title ?? page.title
  page.content = payload.content ?? page.content
  page.excerpt = payload.excerpt ?? page.excerpt
  page.isPublished = payload.isPublished ?? page.isPublished
  page.seoTitle = payload.seoTitle ?? page.seoTitle
  page.seoDescription = payload.seoDescription ?? page.seoDescription

  await page.save()
  return page
}

/*
|--------------------------------------------------------------------------
| Delete Page
|--------------------------------------------------------------------------
*/
export const deletePage = async (id) => {
  const page = await Page.findById(id)
  if (!page) {
    throw new Error('Halaman tidak ditemukan')
  }

  // Halaman fixed (about, contact, dst) sebaiknya tidak dihapus
  if (FIXED_TYPES.includes(page.type)) {
    throw new Error('Halaman bawaan (about/contact/privacy/terms/faq) tidak boleh dihapus')
  }

  await Page.findByIdAndDelete(id)
}

/*
|--------------------------------------------------------------------------
| Public: Get Page by Slug (hanya published)
|--------------------------------------------------------------------------
*/

export const getPublicStaticPages = async () => {
  return Page.find({
    isPublished: true,
    type: { $ne: 'custom' }
  })
  .sort({ type: 1 })
  .select('title slug type')
}

export const getPublicDynamicPages = async () => {
  return Page.find({
    isPublished: true,
    type: 'custom'
  })
  .sort({ type: 1 })
  .select('title slug type')
}

export const getPublicPageBySlug = async (slug) => {
  const page = await Page.findOne({
    slug,
    isPublished: true
  }).lean()

  if (!page) {
    throw new Error('Halaman tidak ditemukan atau belum dipublish')
  }

  return page
}

