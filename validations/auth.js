import { body } from "express-validator";

export const registerValidation = [
    body("email", "Your email is wrong").isEmail(),//check if email is really an email
    body("password", "Password length must be more than 5 symbols").isLength({ min: 5 }),
    body("fullName", "Name length must be more than 3 symbols").isLength({ min: 3 }),
    body("avatarUrl", "Url for avatar is not correct").optional().isURL(),
];