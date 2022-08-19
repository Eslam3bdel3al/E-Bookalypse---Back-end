const {body} = require("express-validator")
var mongoose = require('mongoose');

// var isValid = mongoose.Types.ObjectId.isValid('5c0a7922c9d89830f4911426');

module.exports.wcAddRemove = [
    body("bookIds").isArray().optional()
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    }),
    body("collectionIds").isArray().optional().custom((val) => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    })
]


module.exports.cartAdd = [
    body("bookId").optional().isMongoId().withMessage("userId must be a mongo id"),
    body("collectionObject").optional().custom((val) => {
        if(!val.id){
            throw new Error("id in collectionObject is required")
        }
        if(!mongoose.Types.ObjectId.isValid(val.id)){
            throw new Error("id in collectionObject must be mongo id")
        }
        if(!val.collectionBooks){
            throw new Error("collectionBooks in collectionObject is required")
        }
        if(!val.collectionBooks.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("collectionBooks array items must be a mongo id")
        }
        return true
    })
]
