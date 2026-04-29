import express from 'express'
import cors from 'cors'
import path from 'path'
import { errorHandler } from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import brandRoutes from './routes/brand.routes.js'
import productRoutes from './routes/product.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import storeRoutes from './routes/store.routes.js'
import bannerRoutes from './routes/banner.routes.js'
import socialMediaRoutes from './routes/socialMedia.routes.js'
import pageRoutes from './routes/page.routes.js'
import shippingRoutes from './routes/shipping.routes.js'

import analitycRoutes from './routes/analytics.routes.js'
import seoRoutes from './routes/seo.routes.js'
import sitemapRoutes from './routes/sitemap.routes.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/uploads', express.static(path.resolve('public/uploads')))


app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/banner', bannerRoutes)
app.use('/api/social-media', socialMediaRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/shipping', shippingRoutes)

// google analytics
app.use('/api/analytics', analitycRoutes)
// seo
app.use('/api/seo', seoRoutes)
// sitemap
app.use('/', sitemapRoutes)

app.get('/', (req, res) => {
    res.json({message: "Ecommerce API Running"})
})

app.use(errorHandler)

export default app