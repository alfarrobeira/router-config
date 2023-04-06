import { body, validationResult } from "express-validator";

// Validate request body fields
const userValidation = [
  body("first_name").isLength({ min: 3 }),
  body("last_name").isLength({ min: 3 }),
  body("age").isNumeric({ no_symbols: true }),
  body("email").isEmail(),
];

// Send a status code of 400 (bad request) if any of the restrictions is not fulfilled
const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { userValidation, validateUser };
