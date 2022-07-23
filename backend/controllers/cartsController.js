const mongoose = require("mongoose");

const cart = require("../models/carts")

module.exports.getAllItems = (req,res,next) => {
    cart.find({user_id: mongoose.Types.ObjectId(req.params.userId)})
        .then((data) => {
            if(data == null){
                next(new Error("No items in user's cart"))
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            next(err);
        })
};

module.exports.addItem = (req,res,next) => {
    let object = new cart ({
        user_id: mongoose.Types.ObjectId(req.params.userId),
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
    cart.findOne({_id:mongoose.Types.ObjectId(req.query.cartItemId)})
    .then((data) => {
        if(data == null){
            next( new Error("book dosn't exists in the cart"))
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteItem = (req,res,next) => {
    cart.deleteOne({_id:mongoose.Types.ObjectId(req.query.cartItemId)})
    .then((data) => {
        if(data.deletedCount == 0){
            next(new Error("book dosn't exists in the cart"));
        }else{
            res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err)
    })
       
}