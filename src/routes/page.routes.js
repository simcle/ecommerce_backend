import express from 'express'
import * as PageController from '../controllers/page.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

// admin
router.get('/admin', auth, isAdmin, PageController.getAdminPages)
router.get('/admin/:id', auth, isAdmin, PageController.getAdminPageById)
router.post('/admin', auth, isAdmin, PageController.createPage)
router.put('/admin/:id', auth, isAdmin, PageController.updatePage)
router.delete('/admin/:id', auth, isAdmin, PageController.deletePage)

// public
router.get('/:slug', PageController.getPublicPage)
router.get('/pages/static', PageController.getPublicStaticPages)
router.get('/pages/dynamic', PageController.getPublicDynamicPages)


export default router