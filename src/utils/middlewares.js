import { matchedData, validationResult, checkSchema } from "express-validator";

export const validateSchema = (schema) => [
  checkSchema(schema),
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    next();
  },
];

export const attachData = (req, res, next) => {
  const data = matchedData(req);
  res.locals.data = data;
  next();
};
