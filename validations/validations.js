import { body } from "express-validator";

export const loginValidation = [
    body("email", "Your email is wrong").isEmail(),//check if email is really an email
    body("password", "Password length must be more than 5 symbols").isLength({ min: 5 }),
];

export const registerValidation = [
    body("email", "Your email is wrong").isEmail(),//check if email is really an email
    body("password", "Password length must be more than 5 symbols").isLength({ min: 5 }),
    body("fullName", "Name length must be more than 3 symbols").isLength({ min: 3 }),
    body("avatarUrl", "Url for avatar is not correct").optional().isURL(),
];

export const postCreateValidation = [
    body("title", "Please enter article title").isLength({ min: 3}).isString(),//check if email is really an email
    body("text", "Please enter article text").isLength({ min: 10 }).isString(),
    body("tags", "Please enter more than one tag").optional().isString(),
    body("imageUrl", "Url for image is not correct").optional().isString(),
];