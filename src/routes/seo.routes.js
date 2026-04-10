import express from "express"
import {
  getHomeSeo,
  getProductSeo,
  getCategorySeo,
  getSearchSeo
} from "../controllers/seo.controller.js"

const router = express.Router()

router.get("/home", getHomeSeo)
router.get("/product/:slug", getProductSeo)
router.get("/category/:slug", getCategorySeo)
router.get("/search", getSearchSeo)

export default router