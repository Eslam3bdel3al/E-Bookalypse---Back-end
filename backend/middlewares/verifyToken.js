const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

require("dotenv").config();

module.exports = (req,res,next)=>{
    //check if logged in db or from req el mab3ot mn el front
    try{
        let token  = req.get("Authorization").split(" ")[1];
        let decodedToken = jwt.verify(token,process.env.TOKEN_SECRET);
        req.tokenExist = true
        req.role = decodedToken.role;
        req.userId = decodedToken.id;
        next()        
    }
    catch(error){

        // error.message = "Not autherized",
        // error.status = 403,
        // next(error)
        req.tokenExist = false
        next()
    }
}
