class ErrorResponse extends Error {
	constructor(message, status_code, errors = null) {
		super(message);
		this.status_code = status_code;
		this.errors = errors;
	}
}

module.exports = ErrorResponse;
