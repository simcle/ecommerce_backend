import express from 'express'
import { getDashboardStats } from '../controllers/analytics.controller.js'

import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.get('/dashboard', auth, isAdmin, getDashboardStats)

export default router