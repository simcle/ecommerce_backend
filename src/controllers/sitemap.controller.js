import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Brand from '../models/Brand.js'

export const getSitemap = async (req, res) => {

  const baseUrl = process.env.APP_URL || 'https://domainmu.com'
  try {

    // ambil data
    const [products, categories, brands] = await Promise.all([
      Product.find({ status: 'published' }).select('slug updatedAt').lean(),
      Category.find().select('slug updatedAt').lean(),
      Brand.find().select('slug updatedAt').lean()
    ])

    // static pages
    const staticUrls = [
      `${baseUrl}/`,
      `${baseUrl}/pages/tentang-kami`
    ]

    const buildUrl = (loc, lastmod, priority = 0.7) => `
      <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${priority}</priority>
      </url>
    `

    let urls = ''

    // static
    staticUrls.forEach(url => {
      urls += buildUrl(url, new Date().toISOString(), 1.0)
    })

    // category
    categories.forEach(cat => {
      urls += buildUrl(
        `${baseUrl}/category/${cat.slug}`,
        cat.updatedAt?.toISOString() || new Date().toISOString(),
        0.9
      )
    })

    // brand
    brands.forEach(b => {
      urls += buildUrl(
        `${baseUrl}/brand/${b.slug}`,
        b.updatedAt?.toISOString() || new Date().toISOString(),
        0.8
      )
    })

    // product
    products.forEach(p => {
      urls += buildUrl(
        `${baseUrl}/product/${p.slug}`,
        p.updatedAt?.toISOString() || new Date().toISOString(),
        0.8
      )
    })

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>'
    ].join('')

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.send(xml)

  } catch (error) {
    res.status(500).send('Error generating sitemap')
  }
}