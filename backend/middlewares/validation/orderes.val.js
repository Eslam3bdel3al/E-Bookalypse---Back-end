const {body,param} = require("express-validator")
const mongoose = require("mongoose")

module.exports.userOrders = [
    param("userId").optional().isMongoId().withMessage("param must be a mongo id")
]

module.exports.orderById = [
    param("orderId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("orderId is required")
]


module.exports.addOrder = [
    body("bookIds").isArray()
    .custom(val => {
        if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
            throw new Error("array items must be a mongo id")
        }
        return true
    }).notEmpty().withMessage("bookIds is required"),

    body("totalFinalPrice").isFloat().withMessage("totalFinalPrice Must be a Number").notEmpty().withMessage("totalFinalPrice is required")
    
]
