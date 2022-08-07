const mongoose = require("mongoose");

const user = require("../models/users");

// module.exports.getAllItems = (req,res,next) => {
//     let theId;
//     if(req.role == "user"){
//         theId = req.userId;
//     }else{
//         theId = req.params.userId;
//     }
//     cart.find({user_id: mongoose.Types.ObjectId(theId)}).populate("books")
//         .then((data) => {
//             if(data == null){
//                 next(new Error("No items in user's cart"))
//             } else {
//                 res.status(200).json(data)
//             }
//         })
//         .catch((err) => {
//             next(err);
//         })
// };

module.exports.getCart = (req,res,next) => {
  user.findOne({_id: mongoose.Types.ObjectId(req.userId)},{cart:1}).populate({path:"cart.bookItems",populate:{path:'promotion'}})
  .populate("cart.collectionItems")
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err);
        })
};


// module.exports.addItem = (req,res,next) => {
//     let object = new cart ({
//         user_id: mongoose.Types.ObjectId(req.userId),
//         book: mongoose.Types.ObjectId(req.body.bookId)
//     })
//     object.save()
//         .then((data) => {
//             res.status(201).json({data:"added"})
//         })
//         .catch((err)=>{
//             next(err)
//         })
// };

module.exports.addItems = (req,res,next) => {                       
    const {bookIds,collectionIds,entryFialPrice} = req.body;

    let theAdd = {};

    if (bookIds){
        theAdd["cart.bookItems"] = { $each: bookIds }
    }

    if (collectionIds){
        theAdd["cart.collectionItems"] = { $each: collectionIds }
    }

    user.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.userId)},{
        
        $addToSet:theAdd
        
    })
    .then(async (data)=>{

        bookIds.forEach((book)=>{
            if (data.cart.bookItems.includes(book)){
                throw new Error("a book is already exist");
            }
        })

        collectionIds.forEach((coll)=>{
            if (data.cart.collectionItems.includes(coll)){
                throw new Error("a collection is already exist");
            }
        })

        let price = data.cart.totalPrice + entryFialPrice;

        if(data.cart.bookItems.length == 0 && data.cart.collectionItems.length == 0){              //a chance to reset the totalPrice to narrow miscalc window
            price = entryFialPrice;
        }

        return await user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},
        {
            $set:{"cart.totalPrice":price} 
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


// module.exports.getOneItem = (req,res,next) => {
//     cart.findOne({_id:mongoose.Types.ObjectId(req.params.cartItemId)}).populate("books")
//     .then((data) => {
//         if(data == null){
//             next( new Error("book dosn't exists in the cart"))
//         } else {
//             res.status(200).json(data)
//         }
//     })
//     .catch((err)=>{
//         next(err)
//     })
// }

// module.exports.deleteItem = (req,res,next) => {
//     cart.deleteOne({_id:mongoose.Types.ObjectId(req.params.cartItemId)})
//     .then((data) => {
//         if(data.deletedCount == 0){
//             next(new Error("book dosn't exists in the cart"));
//         }else{
//             res.status(200).json({data:"deleted"});
//         }
//     })
//     .catch((err) => {
//         next(err)
//     })
       
// }

module.exports.deleteItems = (req,res,next) => {

    const {bookIds,collectionIds,entryFialPrice} = req.body;

    let theRemove = {};

    if (bookIds){
        theRemove["cart.bookItems"] = { $in: bookIds }
    }

    if (collectionIds){
        theRemove["cart.collectionItems"] = { $in:collectionIds }
    }

    user.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.userId)},{
        
        $pull:theRemove
        
    })
    .then(async (data)=>{
        
        bookIds.forEach((book)=>{
            if (!data.cart.bookItems.includes(book)){
                throw new Error("a book is not exist");
            }
        })

        collectionIds.forEach((coll)=>{
            if (!data.cart.collectionItems.includes(coll)){
                throw new Error("a collection is not exist");
            }
        })

        let price = data.cart.totalPrice - entryFialPrice;
        return await user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},
        {
            $set:{"cart.totalPrice":price} 
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