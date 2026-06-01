import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export const errorMiddleware = (err, req, res, next) => {
  const isOperational = err.isOperational === true;

  const statusCode = err.statusCode || 500;

  const errorCode = isOperational ? err.errorCode : "INTERNAL_SERVER_ERROR";

  const message = isOperational
    ? err.message
    : "An unexpected error occurred. Please try again later.";

  logger.error("Error", {
    message: err.message,
    stack: err.stack,
    statusCode,
    errorCode,
  });

  const response = {
    success: false,
    error: {
      message,
      code: errorCode,
    },
  };

  if (env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
