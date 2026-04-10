import express from 'express'
import * as SocialMediaController from '../controllers/socialMedia.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get('/admin', auth, isAdmin, SocialMediaController.getAdminSocialMedia)

router.post('/admin', auth, isAdmin, SocialMediaController.createSocialMedia)

router.put('/admin/:id', auth, isAdmin, SocialMediaController.updateSocialMedia)

router.delete('/admin/:id', auth, isAdmin, SocialMediaController.deleteSocialMedia)

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTE
|--------------------------------------------------------------------------
*/

router.get('/', SocialMediaController.getPublicSocialMedia)

export default router