const {body} = require("express-validator")

module.exports.contactVal =  [                   
    body("fName").isAlpha().withMessage("first name can contain only letters ")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("first name is required"),
    
    body("lName").isAlpha().withMessage("last name can contain only letters ")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("last name is required"),
    
    body("email").isEmail().withMessage("email ia not valid")               
    .notEmpty().withMessage("email is required"),
    
    body("phone").isString().withMessage("phone must be a string") 
    .matches(/^010[0-9]{8}$|011[0-9]{8}$|012[0-9]{8}$|015[0-9]{8}$/).withMessage("phone is not valid")        
    .notEmpty().withMessage("phone is required"),
    
    body("title").isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
    body("msg").isString().withMessage("msg must be a string").notEmpty().withMessage("msg is required")
    
];