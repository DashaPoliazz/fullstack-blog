import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password length should be more than 6 chars").isLength({
    min: 6,
  }),
  body("fullName", "Fullname should be more than 3 chars").isLength({ min: 3 }),
];
