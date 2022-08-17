const {body,param} = require("express-validator");
const mongoose = require("mongoose")


module.exports.bookAdd = [
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
    body("description").isString().withMessage("you must have a book description").notEmpty().withMessage("description is required"),
    body("price").isFloat().withMessage("Book Price must be a number").notEmpty().withMessage("price is required"),
    body("date").isDate().withMessage("date is not valid"),
    body("lang").isAlpha().isIn(["عربي","english"]).withMessage("lang must be 'عربي' or 'english'"),
    body("pages").isNumeric().withMessage("pages must be a number"),
    body("publisher").isString().withMessage("publisher must be a string"),
    body("promotion").isMongoId().withMessage("promotion must be a mongo id"),
    body("category").isArray().optional().custom(val => {
        
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
        
    }),
    body("writer").isArray().optional().custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
        
    }),
  ]


  module.exports.bookEdit = [
    param("bookId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("bookId is required"),
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
    body("description").isString().withMessage("you must have a book description").notEmpty().withMessage("description is required"),
    body("price").isFloat().withMessage("Book Price must be a number").notEmpty().withMessage("price is required"),
    body("date").isDate().withMessage("date is not valid"),
    body("lang").isAlpha().isIn(["عربي","english"]).withMessage("lang must be 'عربي' or 'english'"),
    body("pages").isNumeric().withMessage("pages must be a number"),
    body("publisher").isString().withMessage("publisher must be a string"),
    body("promotion").isMongoId().withMessage("promotion must be a mongo id"),
    body("category").isArray().optional()
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    }),
    body("writer").isArray().optional()
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    }),
  ]

  module.exports.bookParam = [
    param("bookId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("bookId is required")
]
