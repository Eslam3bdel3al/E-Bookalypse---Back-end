const jwt = require("jsonwebtoken");


module.exports = (req,res,next)=>{
    try{
        let token  = req.get("Authorization").split(" ")[1];
        let decodedToken = jwt.verify(token,"ourLogSecret");
        req.role = decodedToken.role;
        req.id = decodedToken.id;
        req.userName = decodedToken.userName;
        next()
    }
    catch(error){
        error.message = "Not autherized",
        error.status = 403,
        next(error)
    }
}
