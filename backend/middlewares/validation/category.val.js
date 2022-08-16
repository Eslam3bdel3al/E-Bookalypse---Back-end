const {body,param} = require("express-validator")

module.exports.categoryAdd = [
    body("title").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
]

module.exports.categoryEdit = [
    param("catId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("catId is required"),
    body("title").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required")
]

module.exports.catParam = [
    param("catId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("catId is required")
]