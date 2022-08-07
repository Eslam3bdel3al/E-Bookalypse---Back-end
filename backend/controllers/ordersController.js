const mongoose = require("mongoose");

const order = require("../models/orders");
const book = require("../models/books");

module.exports.getAllOrders = (req,res,next) => {
    let theId;
    if(req.role == "regUser"){
        theId = req.userId;
    }else{
        theId = req.params.userId;
    }
    order.find({user_id: mongoose.Types.ObjectId(theId)}).populate({path:"order_books",populate:{path:'promotion'},
    select:["_id","title","poster","price"]})
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
        order_books:  req.body.bookIds,
        totalPrice: req.body.totalFinalPrice
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
            throw new Error("there is no such order for that user")
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
            throw new Error("there is no such order for that user");
        } else {
        res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err)
    })  
}

module.exports.addBooksToOrder = (req,res,next) => {                        //the body {orderId,bookIds array,booksFialPrice}
    order.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $addToSet:{order_books:{ $each: req.body.bookIds }}
        
    },{upsert:true})
    .then(async (data)=>{

        let notExist = true;
        req.body.bookIds.forEach((book)=>{
            if (data.order_books.includes(book)){
                notExist = false
            }
        })

        if(!notExist){
            throw new Error("a book is already exist");
        }else{

            let price = data.totalPrice + req.body.booksFialPrice;

            if(data.order_books.length == 0){              //a chance to reset the totalPrice to narrow miscalc window
                price = req.body.booksFialPrice;
            }

            return await order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},
            {
               $set:{"totalPrice":price} 
            })
        }

    })
    .then((data)=>{
        if(data.matchedCount == 0){
            throw new Error("not updated");
        }else{
            res.status(200).json(data);
        }
    })
    .catch((err) => {
        next(err);
    })
};


module.exports.removeBooksFromOrder = (req,res,next) => {                   
    order.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $pull:{order_books:{ $in: req.body.bookIds }}
        
    })
    .then(async (data)=>{
        
        let exist = true;
        req.body.bookIds.forEach((book)=>{
            if (!data.order_books.includes(book)){
                exist = false
            }
        })



        if(!exist){
            throw new Error("a book is not exist");
        }else{
            let removedPrice = parseFloat(req.body.booksFialPrice)
            let price = data.totalPrice - removedPrice;
            return await order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},
            {
               $set:{"totalPrice":price} 
            },{upsert:true})
        }

    })
    .then((data)=>{
        if(data.matchedCount == 0){
            throw new Error("not updated");
        }else{
            res.status(200).json(data);
        }
    })
    .catch((err) => {
        next(err);
    })
};

module.exports.changeOrderState = (req,res,next) => {                   //the body {orderId,state}
    order.updateOne({_id: mongoose.Types.ObjectId(req.body.orderId)},{
        
        $set:{state:req.body.state}
        
    }).then((data)=>{
        if(data.matchedCount == 0){
            throw new Error("order is not found");
        }
        else
        {
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

