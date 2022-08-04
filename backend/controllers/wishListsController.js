const mongoose = require("mongoose");

const wishList = require("../models/wishLists");

module.exports.getAllItems = (req,res,next) => {
    let theId;
    if(req.role == "user"){
        theId = req.userId;
    }else{
        theId = req.params.userId;
    }
    wishList.find({user_id: mongoose.Types.ObjectId(theId)}).populate("books")
        .then((data) => {
            if(data == null){
                next(new Error("No items in user's wish list"))
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            next(err);
        })
};

module.exports.addItem = (req,res,next) => {
    let object = new wishList ({
        user_id: mongoose.Types.ObjectId(req.userId),
        book: mongoose.Types.ObjectId(req.body.bookId)
    })
    object.save()
        .then((data) => {
            res.status(201).json({data:"added"})
        })
        .catch((err)=>{
            next(err)
        })
};


module.exports.getOneItem = (req,res,next) => {
    wishList.findOne({_id:mongoose.Types.ObjectId(req.params.wishItemId)})
    .then((data) => {
        if(data == null){
            next( new Error("book dosn't exists in the wish list"))
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteItem = (req,res,next) => {
    wishList.deleteOne({_id:mongoose.Types.ObjectId(req.params.wishItemId)})
    .then((data) => {
        if(data.deletedCount == 0){
            next(new Error("book dosn't exists in the wish list"));
        }else{
            res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err)
    })
       
}