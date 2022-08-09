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

            let price=0;

            if(data.cart){
                data.cart.collectionItems.forEach((coll)=>{
                    price+=coll.collectionPrice
                })
            

                data.cart.bookItems.forEach((book)=>{
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
                throw new Error("you have no cart yet")
            }
            
            res.status(200).json({cart:data.cart,finalPrice:price})
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
    const {bookIds,collectionIds} = req.body;

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
    .then((data)=>{

        if(data.cart){
            if(bookIds){
                bookIds.forEach((book)=>{
                    if (data.cart.bookItems.includes(book)){
                        throw new Error("a book is already exist");
                    }
                })
            }
        
            if(collectionIds){
                collectionIds.forEach((coll)=>{
                    if (data.cart.collectionItems.includes(coll)){
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

    const {bookIds,collectionIds} = req.body;

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
    .then((data)=>{

        if(data.cart){
            if (bookIds){
                bookIds.forEach((book)=>{
                    if (!data.cart.bookItems.includes(book)){
                        throw new Error("a book is not exist");
                    }
                })
            }

            if(collectionIds){
                collectionIds.forEach((coll)=>{
                    if (!data.cart.collectionItems.includes(coll)){
                        throw new Error("a collection is not exist");
                    }
                })
            }

        } else {
            throw new Error("user has no cart yet");
        }

        res.status(200).json("removed");
    })
    .catch((err) => {
        next(err);
    })
}