import { AppError } from "../exceptions/AppError.js";
import { ZodError } from "zod"; // add this import

export const validateMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        for (const key in req.query) {
          delete req.query[key];
        }
        Object.assign(req.query, parsedQuery);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((err) => `${err.path.join(".")} : ${err.message}`)
          .join(", ");
        return next(new AppError(errorMessage, 400, "VALIDATION_ERROR"));
      }
      // Fallback for unexpected errors
      return next(new AppError("Validation failed", 400, "VALIDATION_ERROR"));
    }
  };
};
