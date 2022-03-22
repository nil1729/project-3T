const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// log to console for development
	if (process.env.NODE_ENV === 'development') console.log(err);

	return res.status(error.statusCode || 500).json({
		success: false,
		error: error.message.trim() || 'Internal Server Error',
		details: error.errors || undefined,
	});
};
