const {body,param} = require("express-validator")

module.exports.categoryAdd = [
    body("catTitle").isString().withMessage("should be Letters only").notEmpty().withMessage("catTitle is required"),
]

module.exports.categoryEdit = [
    param("catId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("catId is required"),
    body("catTitle").isString().withMessage("should be Letters only").notEmpty().withMessage("catTitle is required")
]

module.exports.catParam = [
    param("catId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("catId is required")
]