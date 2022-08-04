const mongoose = require("mongoose");

const order = require("../models/orders");
const book = require("../models/books");

module.exports.getAllOrders = (req,res,next) => {
    let theId;
    if(req.role == "user"){
        theId = req.userId;
    }else{
        theId = req.params.userId;
    }

    order.find({user_id: mongoose.Types.ObjectId(theId)})
        .then((data) => {
            if(data == null){
                next(new Error("this user has no orders yet"))
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            next(err);
        })
};

module.exports.addOrder = (req,res,next) => {
   
    let object = new order ({
        user_id: mongoose.Types.ObjectId(req.userId),
        order_books:  req.body.booksArray 
    })
    object.save()
        .then((data) => {
            res.status(201).json({data:"added"})
        })
        .catch((err)=>{
            next(err)
        })
};


module.exports.getOneOrder = (req,res,next) => {
    order.findOne({_id:mongoose.Types.ObjectId(req.params.orderId)})
    .then((data) => {
        if(data == null){
            next( new Error("there is no such order for that user"))
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteOrder = (req,res,next) => {
    order.findOneAndDelete({_id:mongoose.Types.ObjectId(req.params.orderId)})
    .then((data) => {
        if(data == null){
            next(new Error("there is no such order for that user"));
        } else {
        res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err)
    })  
}

module.exports.addBookToOrder = (req,res,next) => {                        //the body {orderId,bookId}
    order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $addToSet:{order_books:req.body.bookId}
        
    })
    .then((data)=>{
        if(data.matchedCount == 0){
            next(new Error("order is not found"));
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

module.exports.removeBookFromOrder = (req,res,next) => {                   //the body {orderId,book [object]}
    order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $pull:{order_books:req.body.bookId}
        
    })
    .then((data)=>{
        if(data.matchedCount == 0){
            next(new Error("order is not found"));
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

module.exports.changeOrderState = (req,res,next) => {                   //the body {orderId,state}
    order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $set:{state:req.body.state}
        
    }).then((data)=>{
        if(data.matchedCount == 0){
            next(new Error("order is not found"));
        }
        else
        {
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

