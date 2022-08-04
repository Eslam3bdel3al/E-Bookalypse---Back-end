const jwt = require("jsonwebtoken");


module.exports = (req,res,next)=>{
    //check if logged in db or from req el mab3ot mn el front
    try{
                //  console.log("ok")
            let token  = req.get("Authorization").split(" ")[1];
            let decodedToken = jwt.verify(token,"ourLogSecret");
            req.role = decodedToken.role;
            req.userId = decodedToken.id;
            next()
        
        
    }
    catch(error){

        error.message = "Not autherized",
        error.status = 403,
        next(error)
    }
}
