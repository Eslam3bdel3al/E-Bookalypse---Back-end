require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const mongoose = require("mongoose");

const user = require("../models/users");

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

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
                        }else{
                            price+=book.price
                        }
                    }else {
                        price+=book.price
                    }
                    
                })
            } else {
                let err = new Error("you have no cart yet");
                err.status = 404;
                throw err
            }
            
            res.status(200).json({cart:data.cart,finalPrice:price.toFixed(2)})
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

// module.exports.addItems = (req,res,next) => {      5588855855                 
//     const {bookIds,collectionIds} = req.body;

//     let theAdd = {};

//     if(bookIds||collectionIds){
//         if (bookIds){
//             theAdd["cart.bookItems"] = { $each: bookIds }
//         }

//         if (collectionIds){
//             theAdd["cart.collectionItems"] = { $each: collectionIds }
//         }
    
//         user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},{
            
//             $addToSet:theAdd
            
//         })
//         .then((data)=>{
        
//             if (data.matchedCount == 1 && data.modifiedCount == 1){
//                 res.status(200).json("added");
//             } else {
//                 throw new Error("all Items you entered are already exist");
//             }
//         })
//         .catch((err) => {
//                 next(err);
//             })
//     } else {
//         next (new Error("you didn't entered any thig"))
//     }
// };


module.exports.addItems =  (req,res,next) => {                       
    const {bookId,collectionObject} = req.body;

    let theAdd = {};

    if(bookId||collectionObject){
        
        user.findOne({_id: mongoose.Types.ObjectId(req.userId)},{cart:1}).populate("cart.collectionItems")
            .then((data) => {

                if(data.cart){

                    if(bookId){
                        if(data.cart.bookItems.includes(bookId)){
                            throw new Error("the book is already exist")
                        }

                        data.cart.collectionItems.forEach((coll)=>{
                            if(coll.collectionBooks.includes(bookId)){
                                throw new Error("the book is already exist")
                            }
                        })
                        
                        theAdd["cart.bookItems"] =  bookId
                    }
                    
                    if(collectionObject){
                       collectionObject.collectionBooks.forEach((theBook)=>{
                            if(data.cart.bookItems.includes(theBook)){
                                throw new Error("a book in the collection is already exist")
                            }

                            data.cart.collectionItems.forEach((coll)=>{
                                if(coll.collectionBooks.includes(theBook)){
                                    throw new Error("a book in the collection is already exist")
                                }
                            })
                       })

                       theAdd["cart.collectionItems"] = collectionObject.id
                    }
                     
                } else {
                    if(bookId){            
                        theAdd["cart.bookItems"] =  bookId
                    }

                    if(collectionObject){
                        theAdd["cart.collectionItems"] = collectionObject.id
                    }

                }
            
            }).then(async (data)=>{
               
                let theResponse = await user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},{
                    $addToSet:theAdd
                })
            
                if (theResponse.matchedCount == 1 && theResponse.modifiedCount == 1){
                    res.status(200).json("added");
                } else {
                    throw new Error("all Items you entered are already exist");
                }
            })
            .catch((err) => {
                next(err);
            })
    }else {
        next (new Error("you didn't entered any thig"))
    }
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

    if(bookIds||collectionIds){

        if (bookIds){
            theRemove["cart.bookItems"] = { $in: bookIds }
        }

        if (collectionIds){
            theRemove["cart.collectionItems"] = { $in:collectionIds }
        }


        user.updateOne({_id: mongoose.Types.ObjectId(req.userId)},{
            
            $pull:theRemove
            
        })
        .then((data)=>{
       
            if (data.matchedCount == 1 && data.modifiedCount == 1){
                res.status(200).json("removed");
            } else {
                throw new Error("non of these Items exists");
            }
        })
        .catch((err) => {
            next(err);
        })
    } else {
        next (new Error("you didn't entered any thig"))
    }
}

module.exports.checkOut = (req,res,next)=>{

    user.findOne({_id: mongoose.Types.ObjectId(req.userId)},{cart:1}).populate({path:"cart.bookItems",populate:{path:'promotion'}})
    .populate("cart.collectionItems")
    .then((data) => {

        let items=[];

        if(data.cart){
            data.cart.collectionItems.forEach((coll)=>{
                items.push({title:coll.title,finalPrice:coll.collectionPrice})
            })
        

            data.cart.bookItems.forEach((book)=>{
                if(book.promotion){
                    let now = new Date();
                    let sDate = new Date(book.promotion.start_date);
                    let eDate = new Date(book.promotion.end_date);
                    if (eDate > now && now > sDate){
                        items.push({title:book.title,finalPrice:(1-book.promotion.discount_rate)*book.price})
                    }else{
                    items.push({title:book.title,finalPrice:book.price})
                    }
                }else {
                items.push({title:book.title,finalPrice:book.price})
            }
                
            })
        } else {
            let err = new Error("you have no cart yet");
            err.status = 404;
            throw err
        }
        return items
    })
    .then(async (items)=>{
        return await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items:items.map((itm)=>{
                return {
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:itm.title
                        },
                        "unit_amount":itm.finalPrice*100
                    },
                    "quantity":1
                }
            }),
            success_url:'https://ebookalypse.herokuapp.com/successPayment',
            cancel_url:'https://ebookalypse.herokuapp.com/cart'
        })
    })
    .then((data)=>{
        res.status(200).json({url: data.url})
    }).catch((err)=>{
        next(err)
    })
}
