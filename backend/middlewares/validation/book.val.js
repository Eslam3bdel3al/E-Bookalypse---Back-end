const {body,param} = require("express-validator");


module.exports.bookAdd = [
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
    body("description").isString().withMessage("you must have a book description").notEmpty().withMessage("description is required"),
    body("price").isFloat().withMessage("Book Price must be a number").notEmpty().withMessage("price is required"),
    body("date").optional().isDate().withMessage("date is not valid"),
    body("lang").optional().optional().isAlpha().isIn(["عربي","english"]).withMessage("lang must be 'عربي' or 'english'"),
    body("pages").optional().isNumeric().withMessage("pages must be a number"),
    body("publisher").optional().isString().withMessage("publisher must be a string"),
    body("promotion").optional().isMongoId().withMessage("promotion must be a mongo id")

    // body("category").isArray().optional().cust.optional()om(val => {
    //      val = JSON.parse(val)
    //      console.log(typeof(val));
    //     if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
    //         throw new Error("array items must be a mongo id")
    //     }
    //     return true
    // }),
    // body("writer").isArray().optional().custom(val => {
    //      val = JSON.parse(val)
    //     if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
    //         throw new Error("array items must be a mongo id")
    //     }
    //     return true
    // }),

  ]


  module.exports.bookEdit = [
    param("bookId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("bookId is required"),
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
    body("description").isString().withMessage("you must have a book description").notEmpty().withMessage("description is required"),
    body("price").isFloat().withMessage("Book Price must be a number").notEmpty().withMessage("price is required"),
    body("date").optional().isDate().withMessage("date is not valid"),
    body("lang").optional().isAlpha().isIn(["عربي","english"]).withMessage("lang must be 'عربي' or 'english'"),
    body("pages").optional().isNumeric().withMessage("pages must be a number"),
    body("publisher").optional().isString().withMessage("publisher must be a string"),
    body("promotion").optional().isMongoId().withMessage("promotion must be a mongo id"),
    // body("category").isArray().optional()
    // .custom(val => {
    //     if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
    //         throw new Error("array items must be a mongo id")
    //     }
    //     return true
    // }),
    // body("writer").isArray().optional()
    // .custom(val => {
    //     if(!val.every(itm => mongoose.Types.ObjectId.isValid(itm))){
    //         throw new Error("array items must be a mongo id")
    //     }
    //     return true
    // }),
  ]

  module.exports.bookParam = [
    param("bookId").isMongoId().withMessage("param must be a mongo id").notEmpty().withMessage("bookId is required")
]
