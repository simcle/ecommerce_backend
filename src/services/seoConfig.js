import StoreSetting from "../models/StoreSetting.js"

let cache = null

export const getSeoConfig = async () => {

  if (cache) return cache

  const setting = await StoreSetting.findOne().lean()

  const SITE_NAME = setting?.name || "Store"
  const SITE_URL = setting?.website || "http://localhost:5173"
  const DESCRIPTION = setting?.description || ""
  const LOGO = setting?.logo || ""
  const absUrl = (path = "") => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${SITE_URL}${path}`
  }

  cache = {
    SITE_NAME,
    SITE_URL,
    DESCRIPTION,
    LOGO,
    absUrl,
    setting
  }

  return cache
}