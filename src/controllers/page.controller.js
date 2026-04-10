import * as PageService from '../services/page.service.js'

/*
|--------------------------------------------------------------------------
| Admin: list pages
|--------------------------------------------------------------------------
*/
export const getAdminPages = async (req, res, next) => {
  try {
    const result = await PageService.getAdminPages(req.query)

    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| Admin: get page by id
|--------------------------------------------------------------------------
*/
export const getAdminPageById = async (req, res, next) => {
  try {
    const page = await PageService.getPageById(req.params.id)

    res.json({
      success: true,
      data: page
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| Admin: create page
|--------------------------------------------------------------------------
*/
export const createPage = async (req, res, next) => {
  try {
    const page = await PageService.createPage(req.body)

    res.status(201).json({
      success: true,
      data: page
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| Admin: update page
|--------------------------------------------------------------------------
*/
export const updatePage = async (req, res, next) => {
  try {
    const page = await PageService.updatePage(req.params.id, req.body)

    res.json({
      success: true,
      data: page
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| Admin: delete page
|--------------------------------------------------------------------------
*/
export const deletePage = async (req, res, next) => {
  try {
    await PageService.deletePage(req.params.id)

    res.json({
      success: true,
      message: 'Halaman berhasil dihapus'
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| Public: get page by slug
|--------------------------------------------------------------------------
*/
export const getPublicPage = async (req, res, next) => {
  try {
    const page = await PageService.getPublicPageBySlug(req.params.slug)

    res.json({
      success: true,
      data: page
    })
  } catch (err) {
    next(err)
  }
}

export const getPublicStaticPages = async (req, res, next) => {
  try {
    const pages = await PageService.getPublicStaticPages()
    res.json(pages)
  } catch (err) {
    next(err)
  }
}

export const getPublicDynamicPages = async (req, res, next) => {
  try {
    const pages = await PageService.getPublicDynamicPages()
    res.json(pages)
  } catch (err) {
    next(err)
  }
}