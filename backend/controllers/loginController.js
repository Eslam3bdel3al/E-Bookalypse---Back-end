const jwt = require("jsonwebtoken");
const bcrypt  = require("bcrypt");

const User = require("../models/users");


module.exports.toLogin = (req,res,next) => {
    User.findOne({$or:[{email:req.body.email},{userName:req.body.userName},{phone:req.body.phone}]})
    .then((data) =>{
        if(!data){
            let error = new Error("email or password is incorrect");
            error.status = 401;
            throw error;
        }
        
        bcrypt.compare(req.body.pass, data.pass, function(err, result) {
            if(result){
                let token  = jwt.sign({
                    id:data._id,
                    role:data.role
                },
                "ourLogSecret",
                {expiresIn:"24h"});
                res.status(200).json({token,msg:"loged in"});
            } else {
                let error = new Error("email or password is incorrect");
                error.status = 401;
                next(error);
            }
            
    })
        
    }).catch((err) => {
        next(err)
    })
};