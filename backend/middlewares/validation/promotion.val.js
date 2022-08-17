const {body,param} = require("express-validator")

module.exports.promotionAdd = [
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("promption title is required"),
  
    body("description").optional().isString().withMessage("description must be a string"),
  
    body("discountRate").isFloat({ min: 0, max: 1 }).withMessage("promption discountRate must be float")
    .notEmpty().withMessage("promption discountRate is required"),
  
    body("startDate").isDate().withMessage("start date is not valid")
    .notEmpty().withMessage("start date is required"),
  
    body("endDate").isDate().withMessage("end date is not valid")
    .notEmpty().withMessage("end date is required")
  ]

  module.exports.promotionEdit = [
    param("promotionId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("promotionId is required"),
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("promption title is required"),
    body("description").optional().isString().withMessage("description must be a string"),
    body("discountRate").isFloat({ min: 0, max: 1 }).withMessage("promption discountRate must be float")
    .notEmpty().withMessage("promption discountRate is required"),
  
    body("startDate").isDate().withMessage("start date is not valid")
    .notEmpty().withMessage("start date is required"),
  
    body("endDate").isDate().withMessage("end date is not valid")
    .notEmpty().withMessage("end date is required")
  ]

  module.exports.promotionParam = [
    param("promotionId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("promotionId is required")
]