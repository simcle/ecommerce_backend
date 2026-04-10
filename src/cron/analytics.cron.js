import cron from "node-cron"
import { syncTodayAnalyticsHourly } from "../services/analytics.service.js"

export const startAnalyticsCron = () => {
  cron.schedule(
  "5 * * * *",
  async () => {
    console.log("[CRON] analytics hourly started")

    try {
      await syncTodayAnalyticsHourly()
      console.log("[CRON] analytics hourly success")
    } catch (error) {
      console.error("[CRON] analytics hourly error:", error.message)
    }
  },
  {
    timezone: "Asia/Jakarta"
  }
)
}