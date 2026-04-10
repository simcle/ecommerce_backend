import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
	logger.error(
		`${req.method} ${req.originalUrl} - ${err.message}`
	)

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || 'Internal Server Error'
	})
}