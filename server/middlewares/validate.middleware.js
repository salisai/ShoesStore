import { ErrorHandler } from "../utils/ErrorHandler.utils.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Collect all Joi error messages
      const messages = error.details.map((err) => err.message);
      return next(new ErrorHandler(400, "Validation failed", messages));
    }
    next();
  };
};
