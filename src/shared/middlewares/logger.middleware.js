import { randomUUID } from "crypto";
import { logger } from "../utils/logger.js";

export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  const requestId = randomUUID();
  req.requestId = requestId;

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    });
  });

  next();
};
