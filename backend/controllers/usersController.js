const User = require("../models/users")
const bcrypt  = require("bcrypt");
const saltRounds = 10;

module.exports.getAllusers = (req,res,next) => {
    // User.find({})
    User.aggregate([
        {
            $lookup:{
                from:"reviews",
                localField: '_id',
                foreignField: 'book_id',
                as: 'reviews',
            }
        },
        {
            $project:{"reviews.book_id":0,"reviews.review_date":0,"reviews.user_id":0,"reviews._id":0,}
        }
    ])
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err)
        })
}

module.exports.userSignUp = (req,res,next) => {
    bcrypt.hash(req.body.pass, saltRounds,(err,hash)=>{
        console.log(req.uploadedImage)
        let object  = new User ({
            
            fName:req.body.fName,
            lName:req.body.lName,
            image:req.uploadedImage,
            date_birth:req.body.date_birth,
            gender:req.body.gender,
            street:req.body.street,
            city:req.body.city,
            governorate:req.body.governorate,
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone,
            pass:hash,
        });
    
        object.save()
                .then((data) => {
                    res.status(201).json({data: "added"})
                })
                .catch( (err) => {
                    console.log(err)
                    next(err)
                })
    })
}


module.exports.getUserByUserName = (req,res,next) => {
    User.findOne({userName:req.query.userName})
        .then((data) => {
            if(data == null){
            next(new Error("user is not found"));
            }else{
                res.status(200).json(data);
            }

        })
        .catch((err) => {
            next(err);
        })
}


module.exports.updateUser = (req,res,next) => {
    bcrypt.hash(req.body.pass, saltRounds,(err,hash)=>{
        User.updateOne({userName: req.body.userName},{
            $set:{
                fName:req.body.fName,
                lName:req.body.lName,
                date_birth:req.body.date_birth,
                gender:req.body.gender,
                street:req.body.street,
                city:req.body.city,
                governorate:req.body.governorate,
                userName:req.body.userName,
                email:req.body.email,
                phone:req.body.phone,
                pass:hash, 
                image:req.uploadedImage
            }
        }).then((data)=>{
            if(data.matchedCount == 0){
                next(new Error("user is not found"));
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
    })
}


module.exports.deleteUser = (req,res,next) => {
    User.deleteOne({userName:req.query.userName})
        .then((data) => {
            if(data.deletedCount == 0){
                next(new Error("user is not found"));
            }else{
                res.status(200).json(data);
            }
        })
        .catch((err) => {
            next(err);
        })
}



module.exports.updateRole = (req,res,next) => {           //body {userName,role}
        User.updateOne({userName: req.body.userName},{
            $set:{
                role:req.body.role
            }
        }).then((data)=>{
            if(data.matchedCount == 0){
                next(new Error("user is not found"));
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
}