const {body,param,query} = require("express-validator")

module.exports.oneUser = [
    param("userId").optional().isMongoId().withMessage("userId must be a mongo id")
]

module.exports.userAdd =  [                   
    body("fName").isAlpha().withMessage("first name can contain only letters ")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("first name is required"),
    
    body("lName").isAlpha().withMessage("last name can contain only letters ")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("last name is required"),
    
    body("date_birth").isDate().withMessage("Date of birth is not valid")
    .isBefore(new Date("01-01-2007").toDateString()).withMessage("Not allowed")
    .notEmpty().withMessage("Date of birth is required"),
    
    body("gender").isAlpha().withMessage("gender can contain only letters")
    .isIn(["male","female"])
    .notEmpty().withMessage("gender is required"),
    
    body("street").isString().withMessage("street must be a string")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("street is required"),
    
    body("city").isString().withMessage("city must be a string")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("city is required"),
    
    body("governorate").isString().withMessage("governorate must be a string")
    .isLength({ min: 3, max:20 })
    .notEmpty().withMessage("governorate is required"),
    
    body("userName").isString().withMessage("user name must be a string")    
    .isLength({ min: 3, max:20 })
    .matches(/^[_a-zA-Z0-9]+$/).withMessage("user name is not valid")
    .notEmpty().withMessage("user name is required"),
    
    body("email").isEmail().withMessage("email ia not valid")               
    .notEmpty().withMessage("email is required"),
    
    body("phone").isString().withMessage("phone must be a string") 
    .matches(/^010[0-9]{8}$|011[0-9]{8}$|012[0-9]{8}$|015[0-9]{8}$/).withMessage("phone is not valid")        
    .notEmpty().withMessage("phone is required"),
    
    body("pass").isString().withMessage("password must be a string")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("password is not valid")        
    .notEmpty().withMessage("password is required"),
    
];
    
module.exports.userEdit =  [   
    body("fName").isAlpha().withMessage("first name can contain only letters ")
                .isLength({ min: 3, max:20 })
                .notEmpty().withMessage("first name is required"),

    body("lName").isAlpha().withMessage("last name can contain only letters ")
                .isLength({ min: 3, max:20 })
                .notEmpty().withMessage("last name is required"),

    body("date_birth").isDate().withMessage("Date of birth is not valid")
                    .isBefore(new Date("01-01-2007").toDateString()).withMessage("Not allowed")
                    .notEmpty().withMessage("Date of birth is required"),

    body("gender").isAlpha().withMessage("gender can contain only letters")
                .isIn(["male","female"])
                .notEmpty().withMessage("gender is required"),

    body("street").isString().withMessage("street must be a string")
                .isLength({ min: 3, max:20 })
                .notEmpty().withMessage("street is required"),

    body("city").isString().withMessage("city must be a string")
                .isLength({ min: 3, max:20 })
                .notEmpty().withMessage("city is required"),

    body("governorate").isString().withMessage("governorate must be a string")
                    .isLength({ min: 3, max:20 })
                    .notEmpty().withMessage("governorate is required"),

    body("userName").isString().withMessage("user name must be a string")    
                    .isLength({ min: 3, max:20 })
                    .matches(/^[_a-zA-Z0-9]+$/).withMessage("user name is not valid")
                    .notEmpty().withMessage("user name is required"),

    body("email").isEmail().withMessage("email ia not valid")               
                    .notEmpty().withMessage("email is required"),

    body("phone").isString().withMessage("phone must be a string") 
                .matches(/^010[0-9]{8}$|011[0-9]{8}$|012[0-9]{8}$|015[0-9]{8}$/).withMessage("phone is not valid")        
                .notEmpty().withMessage("phone is required"),
];

module.exports.userChagePass = [
    body("currentPass").isString().withMessage("Old password must be a string")
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("Old password is not valid")        
                .notEmpty().withMessage("Old password is required"),

    body("newPass").isString().withMessage("new password must be a string")
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("new password is not valid")        
                .notEmpty().withMessage("new password is required")
]
                
module.exports.userRole = [
    body("userName").isString().withMessage("user name must be a string").notEmpty().withMessage("user name is required"),
    body("role").isAlpha().withMessage("role contain only letters").isIn(["rootAdmin", "admin", "regUser"])
];

module.exports.forgetSendMail = [
    body("email").isEmail().withMessage("email ia not valid").notEmpty().withMessage("email is required")
]

module.exports.forgetPassChange = [
    body("pass").isString().withMessage("password must be a string")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("password is not valid")        
    .notEmpty().withMessage("password is required")
]