import * as SeoService from "../services/seo.service.js"

export const getHomeSeo = async (req, res, next) => {
  try {
    const data = await SeoService.getHomeSeo()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getProductSeo = async (req, res, next) => {
  try {
    const data = await SeoService.getProductSeo(req.params.slug)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getCategorySeo = async (req, res, next) => {
  try {
    const data = await SeoService.getCategorySeo(req.params.slug)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const getSearchSeo = async (req, res, next) => {
  try {
    const data = await SeoService.getSearchSeo(req.query.q || "")
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}