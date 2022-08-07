const mongoose = require("mongoose");

const user = require("../models/users");

module.exports.getwishList = (req,res,next) => {
    user.find({_id: mongoose.Types.ObjectId(req.userId)},{wishList:1}).populate({path:"wishList.bookItems",populate:{path:'promotion'}})
    .populate("wishList.collectionItems")
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        next(err);
    })
};

module.exports.addItems = (req,res,next) => {                       
    const {bookIds,collectionIds,entryFialPrice} = req.body;

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
    .then(async (data)=>{
        console.log(data)
        bookIds.forEach((book)=>{
            if (data.wishList.bookItems.includes(book)){
                throw new Error("a book is already exist");
            }
        })

        collectionIds.forEach((coll)=>{
            if (data.wishList.collectionItems.includes(coll)){
                throw new Error("a collection is already exist");
            }
        })

        let price = data.wishList.totalPrice + entryFialPrice;

        if(data.wishList.bookItems.length == 0 && data.wishList.collectionItems.length == 0){              //a chance to reset the totalPrice to narrow miscalc window
            price = entryFialPrice;
        }

        return await user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},
        {
            $set:{"wishList.totalPrice":price} 
        },{upsert:true})

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


module.exports.deleteItems = (req,res,next) => {

    const {bookIds,collectionIds,entryFialPrice} = req.body;

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
    .then(async (data)=>{
        
        bookIds.forEach((book)=>{
            if (!data.wishList.bookItems.includes(book)){
                throw new Error("a book is not exist");
            }
        })

        collectionIds.forEach((coll)=>{
            if (!data.wishList.collectionItems.includes(coll)){
                throw new Error("a collection is not exist");
            }
        })

        let price = data.wishList.totalPrice - entryFialPrice;
        return await user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},
        {
            $set:{"wishList.totalPrice":price} 
        },{upsert:true})

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
}