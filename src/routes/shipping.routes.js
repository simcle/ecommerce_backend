import express from "express"
import * as ShippingController from "../controllers/shipping.controller.js"
import { auth } from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/admin.middleware.js"

const router = express.Router()

// admin
router.get("/", auth, isAdmin, ShippingController.getServices)

router.put("/:id", auth, isAdmin, ShippingController.toggleService)


// public
router.get("/active-couriers", ShippingController.getActiveCouriers)

export default router