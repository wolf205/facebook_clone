import { AppError } from "../exceptions/AppError.js";

export const validateMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")} : ${err.message}`)
        .join(", ");
      return next(new AppError(errorMessage, 400, "VALIDATION_ERROR"));
    }
  };
};
