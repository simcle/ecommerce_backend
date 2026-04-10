import "dotenv/config"
import { BetaAnalyticsDataClient } from "@google-analytics/data"
import AnalyticsHourly from "../models/AnalyticsHourly.js"

const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GA_KEY_FILE
})

const PROPERTY_ID = `properties/${process.env.GA_PROPERTY_ID}`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getTodayDateOnly = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const parseDateHour = (value) => {
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6)) - 1
  const day = Number(value.slice(6, 8))
  const hour = Number(value.slice(8, 10))

  return {
    date: new Date(year, month, day),
    hour
  }
}

const safeMetric = (row, index) => Number(row?.metricValues?.[index]?.value || 0)

const runReportWithRetry = async (payload, retries = 3, delayMs = 1500) => {
  let lastError = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [response] = await analyticsClient.runReport(payload)
      return response
    } catch (error) {
      lastError = error
      console.error(`[GA] runReport failed attempt ${attempt}/${retries}:`, error.message)

      if (attempt < retries) {
        await sleep(delayMs)
      }
    }
  }

  throw lastError
}

const fetchHourlyTrendRows = async () => {
  return runReportWithRetry({
    property: PROPERTY_ID,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    dimensions: [{ name: "dateHour" }],
    metrics: [
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" }
    ],
    orderBys: [{ dimension: { dimensionName: "dateHour" } }]
  })
}

const fetchDeviceRows = async () => {
  return runReportWithRetry({
    property: PROPERTY_ID,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    dimensions: [{ name: "dateHour" }, { name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ dimension: { dimensionName: "dateHour" } }]
  })
}

const fetchCountryRows = async () => {
  return runReportWithRetry({
    property: PROPERTY_ID,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    dimensions: [{ name: "dateHour" }, { name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ dimension: { dimensionName: "dateHour" } }]
  })
}

const fetchSourceRows = async () => {
  return runReportWithRetry({
    property: PROPERTY_ID,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    dimensions: [{ name: "dateHour" }, { name: "sessionSource" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ dimension: { dimensionName: "dateHour" } }]
  })
}

const fetchTopPageRows = async () => {
  return runReportWithRetry({
    property: PROPERTY_ID,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    dimensions: [{ name: "dateHour" }, { name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [
      { dimension: { dimensionName: "dateHour" } },
      { metric: { metricName: "screenPageViews" }, desc: true }
    ],
    limit: 500
  })
}

const ensureHourBucket = (map, date, hour) => {
  const key = `${date.toISOString()}_${hour}`

  if (!map.has(key)) {
    map.set(key, {
      date,
      hour,
      activeUsers: 0,
      newUsers: 0,
      sessions: 0,
      pageViews: 0,
      devices: {},
      countries: {},
      sources: {},
      topPages: [],
      syncStatus: "success",
      syncedAt: new Date(),
      notes: ""
    })
  }

  return map.get(key)
}

const mergeMapMetric = (obj, key, value) => {
  if (!key) return
  obj[key] = (obj[key] || 0) + value
}

export const syncTodayAnalyticsHourly = async () => {
  console.log("[GA] syncTodayAnalyticsHourly started")

  const hourMap = new Map()

  let syncStatus = "success"
  let notes = ""

  try {
    const [trendRes, deviceRes, countryRes, sourceRes, pageRes] = await Promise.all([
      fetchHourlyTrendRows(),
      fetchDeviceRows(),
      fetchCountryRows(),
      fetchSourceRows(),
      fetchTopPageRows()
    ])

    for (const row of trendRes.rows || []) {
      const { date, hour } = parseDateHour(row.dimensionValues[0].value)
      const bucket = ensureHourBucket(hourMap, date, hour)

      bucket.activeUsers = safeMetric(row, 0)
      bucket.newUsers = safeMetric(row, 1)
      bucket.sessions = safeMetric(row, 2)
      bucket.pageViews = safeMetric(row, 3)
    }

    for (const row of deviceRes.rows || []) {
      const { date, hour } = parseDateHour(row.dimensionValues[0].value)
      const device = row.dimensionValues[1]?.value || "unknown"
      const bucket = ensureHourBucket(hourMap, date, hour)

      mergeMapMetric(bucket.devices, device, safeMetric(row, 0))
    }

    for (const row of countryRes.rows || []) {
      const { date, hour } = parseDateHour(row.dimensionValues[0].value)
      const country = row.dimensionValues[1]?.value || "unknown"
      const bucket = ensureHourBucket(hourMap, date, hour)

      mergeMapMetric(bucket.countries, country, safeMetric(row, 0))
    }

    for (const row of sourceRes.rows || []) {
      const { date, hour } = parseDateHour(row.dimensionValues[0].value)
      const source = row.dimensionValues[1]?.value || "unknown"
      const bucket = ensureHourBucket(hourMap, date, hour)

      mergeMapMetric(bucket.sources, source, safeMetric(row, 0))
    }

    for (const row of pageRes.rows || []) {
      const { date, hour } = parseDateHour(row.dimensionValues[0].value)
      const path = row.dimensionValues[1]?.value || "/"
      const views = safeMetric(row, 0)
      const bucket = ensureHourBucket(hourMap, date, hour)

      bucket.topPages.push({ path, views })
    }

    for (const bucket of hourMap.values()) {
      bucket.topPages = bucket.topPages
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
    }
  } catch (error) {
    syncStatus = "failed"
    notes = error.message
    console.error("[GA] sync failed:", error.message)
    throw error
  } finally {
    const ops = []

    for (const bucket of hourMap.values()) {
      ops.push({
        updateOne: {
          filter: { date: bucket.date, hour: bucket.hour },
          update: {
            $set: {
              activeUsers: bucket.activeUsers,
              newUsers: bucket.newUsers,
              sessions: bucket.sessions,
              pageViews: bucket.pageViews,
              devices: bucket.devices,
              countries: bucket.countries,
              sources: bucket.sources,
              topPages: bucket.topPages,
              syncStatus,
              syncedAt: new Date(),
              notes
            }
          },
          upsert: true
        }
      })
    }

    if (ops.length) {
      await AnalyticsHourly.bulkWrite(ops)
      console.log(`[GA] synced ${ops.length} hourly buckets`)
    } else {
      console.log("[GA] no hourly rows returned")
    }
  }
}