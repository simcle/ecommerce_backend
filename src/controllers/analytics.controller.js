import * as DashboardService from '../services/analytics.dashboard.service.js'

export const getDashboardStats = async (req, res, next) => {

  try {
    const {range} = req.query
    const visitorsToday = await DashboardService.getAnalyticsDashboard(range)

    res.json({
      visitorsToday
    })

  } catch (err) {
    next(err)
  }

}