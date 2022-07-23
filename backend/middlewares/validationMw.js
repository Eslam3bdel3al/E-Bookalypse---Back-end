const {validationResult}= require("express-validator")

module.exports = (req,res,next) => {
    let result = validationResult(req);
    if (!result.isEmpty()){
        let msg = result.errors.reduce((current,error) => (current +" "+error.msg+" "),"");
        let err = new Error(msg);
        err.status = 422;
        throw err;
    } else {
        next();
    }
}