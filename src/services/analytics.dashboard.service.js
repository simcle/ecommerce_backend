import AnalyticsHourly from "../models/AnalyticsHourly.js"


/*
|--------------------------------------------------------------------------
| Resolve Date Range
|--------------------------------------------------------------------------
*/

const resolveDateRange = (range) => {

  const now = new Date()

  const start = new Date(now)
  const end = new Date(now)

  start.setHours(0,0,0,0)
  end.setHours(23,59,59,999)

  if (range === "today") {
    return { start, end }
  }

  if (range === "7") {
    start.setDate(start.getDate() - 6)
    return { start, end }
  }

  if (range === "30") {
    start.setDate(start.getDate() - 29)
    return { start, end }
  }

  start.setDate(start.getDate() - 6)

  return { start, end }
}


/*
|--------------------------------------------------------------------------
| Format Helpers
|--------------------------------------------------------------------------
*/

const formatLabel = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short"
  })
}

const formatHour = (hour) => {
  return `${String(hour).padStart(2,"0")}:00`
}


/*
|--------------------------------------------------------------------------
| Get Analytics Dashboard
|--------------------------------------------------------------------------
*/

export const getAnalyticsDashboard = async (range = "7") => {

  const { start, end } = resolveDateRange(range)

  const isToday = range === "today"

  const result = await AnalyticsHourly.aggregate([

    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },

    {
      $facet: {

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        summary: [
          {
            $group: {
              _id: null,
              activeUsers: { $sum: "$activeUsers" },
              newUsers: { $sum: "$newUsers" },
              sessions: { $sum: "$sessions" },
              pageViews: { $sum: "$pageViews" }
            }
          }
        ],


        /*
        |--------------------------------------------------------------------------
        | TREND
        |--------------------------------------------------------------------------
        */

        trend: isToday
          ? [
              {
                $group: {
                  _id: "$hour",
                  activeUsers: { $sum: "$activeUsers" },
                  newUsers: { $sum: "$newUsers" },
                  sessions: { $sum: "$sessions" },
                  pageViews: { $sum: "$pageViews" }
                }
              },
              { $sort: { _id: 1 } }
            ]
          : [
              {
                $group: {
                  _id: "$date",
                  activeUsers: { $sum: "$activeUsers" },
                  newUsers: { $sum: "$newUsers" },
                  sessions: { $sum: "$sessions" },
                  pageViews: { $sum: "$pageViews" }
                }
              },
              { $sort: { _id: 1 } }
            ],


        /*
        |--------------------------------------------------------------------------
        | DEVICES
        |--------------------------------------------------------------------------
        */

        devices: [
          { $project: { devices: { $objectToArray: "$devices" } } },
          { $unwind: "$devices" },
          {
            $group: {
              _id: "$devices.k",
              value: { $sum: "$devices.v" }
            }
          },
          { $sort: { value: -1 } }
        ],


        /*
        |--------------------------------------------------------------------------
        | COUNTRIES
        |--------------------------------------------------------------------------
        */

        countries: [
          { $project: { countries: { $objectToArray: "$countries" } } },
          { $unwind: "$countries" },
          {
            $group: {
              _id: "$countries.k",
              value: { $sum: "$countries.v" }
            }
          },
          { $sort: { value: -1 } },
          { $limit: 10 }
        ],


        /*
        |--------------------------------------------------------------------------
        | SOURCES
        |--------------------------------------------------------------------------
        */

        sources: [
          { $project: { sources: { $objectToArray: "$sources" } } },
          { $unwind: "$sources" },
          {
            $group: {
              _id: "$sources.k",
              value: { $sum: "$sources.v" }
            }
          },
          { $sort: { value: -1 } },
          { $limit: 10 }
        ],


        /*
        |--------------------------------------------------------------------------
        | TOP PAGES
        |--------------------------------------------------------------------------
        */

        topPages: [
          { $unwind: "$topPages" },
          {
            $group: {
              _id: "$topPages.path",
              views: { $sum: "$topPages.views" }
            }
          },
          { $sort: { views: -1 } },
          { $limit: 10 }
        ]

      }
    }

  ])


  const data = result[0]


  return {

    summary: data.summary[0] || {
      activeUsers: 0,
      newUsers: 0,
      sessions: 0,
      pageViews: 0
    },

    trend: data.trend.map(item => ({
      date: isToday
        ? formatHour(item._id)
        : formatLabel(item._id),
      activeUsers: item.activeUsers,
      newUsers: item.newUsers,
      sessions: item.sessions,
      pageViews: item.pageViews
    })),

    devices: data.devices.map(i => ({
      label: i._id,
      value: i.value
    })),

    countries: data.countries.map(i => ({
      label: i._id,
      value: i.value
    })),

    sources: data.sources.map(i => ({
      label: i._id,
      value: i.value
    })),

    topPages: data.topPages.map(i => ({
      path: i._id,
      views: i.views
    }))

  }

}