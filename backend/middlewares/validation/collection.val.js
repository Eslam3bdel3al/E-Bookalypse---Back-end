const {body,param} = require("express-validator")
 const mongoose = require("mongoose");

module.exports.collectioAdd = [
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("collection title is required"),
    body("description").isString().withMessage("title must be a string"),
    body("collectionPrice").isFloat().withMessage("collection price must be float")
                        .notEmpty().withMessage("collection price is required"),
    body("collectionBooks").isArray({min:3}).withMessage("minimum three books in the collection")
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    })
    .notEmpty().withMessage("collection books are required"),

]

module.exports.collectionEdit = [
    param("collectionId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("collectionId is required"),
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("collection title is required"),
    body("description").isString().withMessage("title must be a string"),
    body("collectionPrice").isFloat().withMessage("collection price must be float")
                        .notEmpty().withMessage("collection price is required"),
    body("collectionBooks").isArray({min:3}).withMessage("minimum three books in the collection")
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    })
    .notEmpty().withMessage("collection books are required"),
]

module.exports.collectionParam = [
    param("collectionId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("collectionId is required")
]
