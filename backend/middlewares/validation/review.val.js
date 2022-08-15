const {body,param} = require("express-validator")

module.exports.userReviews = [
    param("userId").isMongoId().withMessage("userId must be a mongo id")
]

module.exports.bookReviews = [
    param("bookId").isMongoId().withMessage("bookId must be a mongo id").notEmpty().withMessage("bookId is required")
]

module.exports.getDelete = [
    param("reviewId").isMongoId().withMessage("reviewId must be a mongo id").notEmpty().withMessage("reviewId is required")
]

module.exports.reviewAdd = [
    body("bookId").isMongoId().withMessage("bookId must be a mongo id").notEmpty().withMessage("bookId is required"),
    body("comment").isString().withMessage("comment must be a string"),
    body("vote").isInt({ min: 0, max: 5 }).withMessage("review vote must be Int from 1 to 5")
                .notEmpty().withMessage("review vote is required"),
]

module.exports.reviewEdit = [
    param("reviewId").isMongoId().withMessage("reviewId must be a mongo id").notEmpty().withMessage("reviewId is required"),
    body("comment").isString().withMessage("comment must be a string"),
    body("vote").isInt({ min: 0, max: 5 }).withMessage("review vote must be Int from 1 to 5")
                .notEmpty().withMessage("review vote is required"),
]