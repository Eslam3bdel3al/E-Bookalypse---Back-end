const mongoose = require("mongoose");

const user = require("../models/users");

module.exports.getwishList = (req,res,next) => {
    user.findOne({_id: mongoose.Types.ObjectId(req.userId)},{wishList:1}).populate({path:"wishList.bookItems",populate:{path:'promotion'}})
    .populate("wishList.collectionItems")
    .then((data) => {
        console.log(data)
        let price=0;

        if(data.wishList){
            data.wishList.collectionItems.forEach((coll)=>{
                price+=coll.collectionPrice
            })
        

            data.wishList.bookItems.forEach((book)=>{
                if(book.promotion){
                    let now = new Date();
                    let sDate = new Date(book.promotion.start_date);
                    let eDate = new Date(book.promotion.end_date);
                    if (eDate > now && now > sDate){
                        price+= (1-book.promotion.discount_rate)*book.price
                    }
                }else {
                    price+=book.price
                }
            })
        } else {
            throw new Error("you have no wishList yet")
        }
        
        res.status(200).json({wishList:data.wishList,finalPrice:price})
    })
    .catch((err) => {
        next(err);
    })
};

module.exports.addItems = (req,res,next) => {                       
    const {bookIds,collectionIds} = req.body;

    let theAdd = {};

    if (bookIds){
        theAdd["wishList.bookItems"] = { $each: bookIds }
    }

    if (collectionIds){
        theAdd["wishList.collectionItems"] = { $each: collectionIds }
    }

    user.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.userId)},{
        
        $addToSet:theAdd
        
    })
    .then((data)=>{

        if(data.wishList){
            if(bookIds){
                bookIds.forEach((book)=>{
                    if (data.wishList.bookItems.includes(book)){
                        throw new Error("a book is already exist");
                    }
                })
            }
        
            if(collectionIds){
                collectionIds.forEach((coll)=>{
                    if (data.wishList.collectionItems.includes(coll)){
                        throw new Error("a collection is already exist");
                    }
                })
            }
        }
        res.status(200).json("added");
    })
    .catch((err) => {
            next(err);
        })
};


module.exports.deleteItems = (req,res,next) => {

    const {bookIds,collectionIds} = req.body;

    let theRemove = {};

    if (bookIds){
        theRemove["wishList.bookItems"] = { $in: bookIds }
    }

    if (collectionIds){
        theRemove["wishList.collectionItems"] = { $in:collectionIds }
    }

    user.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.userId)},{
        
        $pull:theRemove
        
    })
    .then((data)=>{

        if(data.wishList){
            if (bookIds){
                bookIds.forEach((book)=>{
                    if (!data.wishList.bookItems.includes(book)){
                        throw new Error("a book is not exist");
                    }
                })
            }

            if(collectionIds){
                collectionIds.forEach((coll)=>{
                    if (!data.wishList.collectionItems.includes(coll)){
                        throw new Error("a collection is not exist");
                    }
                })
            }

        } else {
            throw new Error("user has no wishList yet");
        }

        res.status(200).json("removed");
    })
    .catch((err) => {
        next(err);
    })
}