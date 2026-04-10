import SeoMeta from "../models/SeoMeta.js"
import Product from "../models/Product.js"
import Category from "../models/Category.js"
import { getSeoConfig } from "./seoConfig.js"


export const getHomeSeo = async () => {

  const { SITE_NAME, SITE_URL, DESCRIPTION, LOGO, absUrl, setting } =
    await getSeoConfig()

  const seo = await SeoMeta.findOne({
    entityType: "home",
    routeKey: "home",
    isActive: true
  }).lean()

  return {
    title:
      seo?.title ||
      `${SITE_NAME} - ${setting?.tagLine || "Produk Kulit Handmade Garut"}`,

    description:
      seo?.description ||
      DESCRIPTION ||
      "Toko produk kulit handmade Garut.",

    canonicalUrl: seo?.canonicalUrl || SITE_URL,

    ogTitle: seo?.ogTitle || `${SITE_NAME}`,

    ogDescription:
      seo?.ogDescription ||
      DESCRIPTION,

    ogImage: absUrl(seo?.ogImage || LOGO),

    ogType: "website",

    robots: seo?.robots || "index,follow",

    structuredData:
      seo?.structuredData || {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absUrl(LOGO),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: setting?.phone,
          contactType: "customer service"
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: setting?.address
        }
      }
  }
}

export const getProductSeo = async (slug) => {
  const { SITE_NAME, SITE_URL, DESCRIPTION, LOGO, absUrl, setting } = await getSeoConfig()
  const product = await Product.findOne({ slug, status: "published" })
    .populate("brandId", "name")
    .populate("categoryId", "name slug path")
    .lean()

  if (!product) throw new Error("Product tidak ditemukan")

  const seo = await SeoMeta.findOne({
    entityType: "product",
    entityId: product._id,
    isActive: true
  }).lean()

  const price = product.hasVariant
    ? Math.min(...(product.variants || []).map(v => v.price || 0).filter(Boolean))
    : product.price || 0

  const image = product.images?.[0] || ""

  return {
    title:
      seo?.title ||
      `${product.name}${product.brandId?.name ? ` - ${product.brandId.name}` : ""} | ${SITE_NAME}`,
    description:
      seo?.description ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `${product.name} tersedia di ${SITE_NAME}.`,
    keywords: seo?.keywords || [],
    canonicalUrl: seo?.canonicalUrl || `${SITE_URL}/product/${product.slug}`,
    ogTitle: seo?.ogTitle || seo?.title || product.name,
    ogDescription:
      seo?.ogDescription ||
      seo?.description ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `${product.name} tersedia di ${SITE_NAME}.`,
    ogImage: absUrl(seo?.ogImage || image),
    ogType: seo?.ogType || "product",
    twitterCard: seo?.twitterCard || "summary_large_image",
    robots: seo?.robots || "index,follow",
    structuredData:
      seo?.structuredData || {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: image ? [absUrl(image)] : [],
        description: product.description?.replace(/<[^>]*>/g, "").slice(0, 300) || "",
        sku: product.sku || product.variants?.[0]?.sku || "",
        brand: product.brandId?.name
          ? {
              "@type": "Brand",
              name: product.brandId.name
            }
          : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "IDR",
          price,
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/product/${product.slug}`
        }
      }
  }
}

export const getCategorySeo = async (slug) => {
  const { SITE_NAME, SITE_URL, DESCRIPTION, LOGO, absUrl, setting } = await getSeoConfig()
  const category = await Category.findOne({ slug, isActive: true }).lean()
  if (!category) throw new Error("Category tidak ditemukan")

  const seo = await SeoMeta.findOne({
    entityType: "category",
    entityId: category._id,
    isActive: true
  }).lean()

  return {
    title: seo?.title || `${category.name} | ${SITE_NAME}`,
    description:
      seo?.description ||
      category.description ||
      `Temukan produk ${category.name} terbaik di ${SITE_NAME}.`,
    keywords: seo?.keywords || [],
    canonicalUrl: seo?.canonicalUrl || `${SITE_URL}/category/${category.slug}`,
    ogTitle: seo?.ogTitle || seo?.title || `${category.name} | ${SITE_NAME}`,
    ogDescription:
      seo?.ogDescription ||
      seo?.description ||
      category.description ||
      `Temukan produk ${category.name} terbaik di ${SITE_NAME}.`,
    ogImage: absUrl(seo?.ogImage || category.logo),
    ogType: seo?.ogType || "website",
    twitterCard: seo?.twitterCard || "summary_large_image",
    robots: seo?.robots || "index,follow",
    structuredData:
      seo?.structuredData || {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          ...(category.path || []).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}/category/${item.slug}`
          })),
          {
            "@type": "ListItem",
            position: (category.path?.length || 0) + 1,
            name: category.name,
            item: `${SITE_URL}/category/${category.slug}`
          }
        ]
      }
  }
}

export const getSearchSeo = async (q = "") => {
  const { SITE_NAME, SITE_URL, DESCRIPTION, LOGO, absUrl, setting } = await getSeoConfig()
  const seo = await SeoMeta.findOne({
    entityType: "search",
    routeKey: "search",
    isActive: true
  }).lean()

  return {
    title: q ? `Hasil pencarian "${q}" | ${SITE_NAME}` : `Pencarian | ${SITE_NAME}`,
    description:
      seo?.description ||
      (q
        ? `Hasil pencarian untuk "${q}" di ${SITE_NAME}.`
        : `Cari produk terbaik di ${SITE_NAME}.`),
    keywords: seo?.keywords || [],
    canonicalUrl: q ? `${SITE_URL}/search?q=${encodeURIComponent(q)}` : `${SITE_URL}/search`,
    ogTitle: q ? `Hasil pencarian "${q}" | ${SITE_NAME}` : `Pencarian | ${SITE_NAME}`,
    ogDescription:
      seo?.ogDescription ||
      (q
        ? `Hasil pencarian untuk "${q}" di ${SITE_NAME}.`
        : `Cari produk terbaik di ${SITE_NAME}.`),
    ogImage: absUrl(seo?.ogImage),
    ogType: "website",
    twitterCard: seo?.twitterCard || "summary_large_image",
    robots: "noindex,follow",
    structuredData: null
  }
}