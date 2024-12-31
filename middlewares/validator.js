const { body, validationResult} = require("express-validator")



const validateRegistration = [
    body("username")
        .trim()
        .isLength({min: 5, max: 10}).withMessage("Username characters must be between 5 and 10")
        .notEmpty().withMessage("username cannot be empty")
        .escape(),

    body("password")
        .isLength({min: 8}).withMessage("Password cannot be less than 8")
        .custom(value => {

        }).withMessage("")
]