const mongoose = require("mongoose");

const review = require("../models/reviews");

module.exports.getAllUserReviews = (req,res,next) => {
    let theId;
    if(req.role == "regUser"){
        theId = req.userId;
    }else{
        theId = req.params.userId;
    }
    review.find({user_id: mongoose.Types.ObjectId(theId)})
        .then((data) => {
            if(data == null){
                let err = new Error("this user hasn't made any reviews yet");
                err.status = 404;
                throw err
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            next(err);
        })
};

module.exports.getAllBookReviews = (req,res,next) => {
    review.find({book_id: mongoose.Types.ObjectId(req.params.bookId)}).populate({path:"user_id",select:["_id","userName","image"]})
        .then((data) => {
            if(data == null){
                let err = new Error("this Book hasn't any reviews yet");
                err.status = 404;
                throw err
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            next(err);
        })
};


module.exports.getOneReview = (req,res,next) => {
    review.findOne({_id:mongoose.Types.ObjectId(req.params.reviewId)})
    .then((data) => {
        if(data == null){
            let err = new Error("Review dosn't exists");
            err.status = 404;
            throw err
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports.addReview = (req,res,next) => {
    let object = new review ({
        user_id: mongoose.Types.ObjectId(req.userId),
        book_id: mongoose.Types.ObjectId(req.body.bookId),
        comment: req.body.comment,
        vote: req.body.vote,
    })
    object.save()
        .then((data) => {
            res.status(201).json({data:"added"})
        })
        .catch((err)=>{
            next(err)
        })
};


module.exports.updateReview = (req,res,next) => {           //body {comment,vote}
    review.updateOne({_id: req.params.reviewId},{
        $set:{
            comment: req.body.comment,
            vote: req.body.vote,
        }
    }).then((data)=>{
        if(data.matchedCount == 0){
            let err = new Error("Review dosn't exists");
            err.status = 404;
            throw err
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
}


module.exports.deleteReview = (req,res,next) => {
    review.findOneAndDelete({_id:mongoose.Types.ObjectId(req.params.reviewId)})
    .then((data) => {
        if(data == null){
            let err = new Error("Review dosn't exists");
            err.status = 404;
            throw err
        }else{
        res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err)
    })
       
}