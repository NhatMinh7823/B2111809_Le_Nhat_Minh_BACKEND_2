class ApiError extends Error {
    constructor(statusCode, message) {
        super(); // Call the parent Error class constructor
        this.statusCode = statusCode; // Assign the provided status code
        this.message = message; // Assign the provided error message
    }
}
module.exports = ApiError;
