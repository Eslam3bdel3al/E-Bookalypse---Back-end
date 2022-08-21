require("dotenv").config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt  = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUND);

const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.TRANSPORTER_API_KEY)

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

const transporter = nodemailer.createTransport(sgTransport({
    auth:{
        api_key: process.env.TRANSPORTER_API_KEY
    }
}));

const User = require("../models/users");
const Reviews = require('../models/reviews');
const Orders = require('../models/orders');

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

module.exports.getAdmins = (req,res,next) => {
    User.find({role:{$in:["rootAdmin", "admin"]}})   
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err)
        })
}

module.exports.userSignUp = (req,res,next) => {
    User.findOne({$or:[{email:req.body.email},{userName:req.body.userName},{phone:req.body.phone}]})
    .then((userDoc) => {
        if(userDoc){
            throw new Error("user already exist");
        }
        bcrypt.hash(req.body.pass, saltRounds,(err,hash)=>{
            if (err){
                next(err)
            } else {
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
            }      
        })
    })
    .then((data) => {
        res.status(201).json("signed up successfully")

        transporter.sendMail({
            to: req.body.email,
            from: "abdelalleslam@gmail.com",
            subject: "signed up successfully!",
            html:"<h1>Welcome to our book store</h1>"
        })
    })
    .catch((err)=>{ 
        next(err)})
}


module.exports.getUserById = (req,res,next) => {
    let theId;
    if(req.role == "regUser"){
        theId = req.userId;
    }else{
        if(req.params.userId){
            theId = req.params.userId;
        }else{
            theId=req.userId
        }
    }
    User.findOne({_id: mongoose.Types.ObjectId(theId)})
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        })
}


module.exports.getBookShelf = (req,res,next) => {
   
    User.findOne({_id: mongoose.Types.ObjectId(req.userId)},{book_shelf:1}).populate({path:"book_shelf",
    select:["_id","title","poster","source","n_pages"]})
        .then((data) => {
            res.status(200).json(data.book_shelf);
        })
        .catch((err) => {
            next(err);
        })
}


module.exports.updateUser = (req,res,next) => {
        User.updateOne({_id: req.userId},{
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
                image:req.uploadedImage
            }
        }).then((data)=>{
            if(data.matchedCount == 0){
                let err = new Error("user is not found");
                err.status = 404;
                throw err
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
}

module.exports.changePass = (req,res,next) => {
    User.findOne({_id: req.userId})
    .then((data)=>{
       
        bcrypt.compare(req.body.currentPass, data.pass, (err, result) => {
            if(result){

                bcrypt.hash(req.body.newPass, saltRounds,(err,hash)=>{
                    User.updateOne({_id: req.userId},{
                        $set:{
                            pass:hash, 
                        }
                    }).then((data)=>{
                            res.status(200).json(data);
                    }).catch((err) => {
                        next(err);
                    })
                })

            } else {
                let error = new Error("Password is incorrect");
                error.status = 401;
                next(error);
            }
        })
        
    }).catch((err) => {
        next(err)
    }) 
}


module.exports.forgetChangePass = (req,res,next) => {
    
        bcrypt.hash(req.body.pass, saltRounds,(err,hash)=>{
            if(err){
                next(err);
            }else{

                User.updateOne({_id: req.userId},{
                    $set:{
                        pass:hash, 
                    }
                }).then((data)=>{
                    if(data.acknowledged == false){
                        let err = new Error("user is not found");
                        err.status = 404;
                        throw err
                    }
                    res.status(200).json(data);
                }).catch((err) => {
                    next(err);
                })

            }
        })
}


module.exports.deleteUser = (req,res,next) => {
   
    User.deleteOne({_id:mongoose.Types.ObjectId(req.userId)})
        .then(async (data) => {
            if(data.deletedCount == 0){
                let err = new Error("user is not found");
                err.status = 404;
                throw err
            }else{

                await Reviews.deleteOne({user_id:mongoose.Types.ObjectId(req.userId)});
                await Orders.deleteOne({user_id:mongoose.Types.ObjectId(req.userId)});
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
                let err = new Error("user is not found");
                err.status = 404;
                throw err
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
};


module.exports.forgetSendMail = (req,res,next) => {
    User.findOne({email:req.body.email})
    .then((data) =>{
        if(!data){
            let error = new Error("email doesn't exist");
            error.status = 401;
            throw error;
        }

        let token  = jwt.sign({
            id:data._id,
        },
        process.env.TOKEN_SECRET,
        {expiresIn:"1h"});
        return {token,userId:data._id};
    })
    .then(({token,userId}) => {
        let base_url= "https://ebookalypse.herokuapp.com/"
        transporter.sendMail({
            to: req.body.email,
            from: "abdelalleslam@gmail.com",
            subject: "change your password",
            html:`<a href='${base_url}resetPass/${token}'>Click here to change password</a>`
        })
        // sgMail.send({
        //     to: req.body.email,
        //     from: "abdelalleslam@gmail.com",
        //     subject: "change your password",
        //     html:`<a href='${base_url}resetPass/${token}'>Click here to change password</a>`
        // })
        .then((data)=>{    
            res.status(201).json({token ,data: "mail sent"})
        }).catch((err)=>{
            console.log(err)
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
};