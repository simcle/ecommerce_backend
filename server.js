import 'dotenv/config'
import app from './src/app.js'
import { connectDB } from './src/config/database.js'
import logger from './src/utils/logger.js'
import { initializeSystemPages } from './src/services/pageInitializer.service.js'
import { initializeDefaultSocialMedia } from './src/services/socialMediaInitializer.service.js'
import { syncServices } from './src/services/biteship.service.js'
import { startAnalyticsCron } from './src/cron/analytics.cron.js'

const PORT = 3000 || process.env.PORT

await connectDB()
await initializeSystemPages()
await initializeDefaultSocialMedia()
await syncServices()
startAnalyticsCron()
app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`)
})

