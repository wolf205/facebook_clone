export class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);

    this.statusCode = statusCode || 500;

    this.errorCode = errorCode || "INTERNAL_SERVER_ERROR";

    this.isOperational = true;

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}
