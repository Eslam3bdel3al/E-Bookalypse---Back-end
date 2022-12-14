const {body,param} = require("express-validator")


module.exports.writerAdd = [
    body("name").isAlpha().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
    body("gender").optional().isAlpha().withMessage("gender can contain only letters").isIn(["male","female"]),
    body("bio").optional().isString().withMessage("bio must be a string"),
    body("date_birth").optional().isDate().withMessage("Birth date is not valid"),
    body("place_birth").optional().isString().withMessage("governorate must be a string")
]

module.exports.writerUpdate = [
    param("writerId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("writerId is required"),
    body("name").isAlpha().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
    body("gender").optional().isAlpha().withMessage("gender can contain only letters").isIn(["male","female"]),
    body("bio").optional().isString().withMessage("bio must be a string"),
    body("date_birth").optional().isDate().withMessage("Birth date is not valid"),
    body("place_birth").optional().isString().withMessage("governorate must be a string")
]

module.exports.writerParam = [
    param("writerId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("writerId is required")
]

