const mongoose = require("mongoose")

const BookModel = require('../models/books');
const reviews = require ("../models/reviews")

// module.exports.getAllBooks = (req,res,next)=>{                              //query string page,limit
    
//     let {page = 1, limit = 10} = req.query;

//     BookModel.countDocuments().then((count)=>{

//         BookModel.find({}).populate({path:"category"}).populate({path:"writer"})
//             .limit(limit).skip((page - 1)*limit)
//             .then( async (booksData) => {
                
//                await booksData.forEach( (book)=>{
//                     reviews.find({book_id: book._id}).then((data)=>{
//                         console.log(data)
//                         book.reviews = data;
//                         console.log(book)
//                     }).catch((err)=>{next(err)})
//                 });


//                 return booksData;

//             }).then((booksData)=>{
//                 let returned = {
//                     n_results : count,
//                     n_pages : Math.ceil(count/limit),
//                     page,
//                     data:booksData
//                 }
//                 res.status(200).json(returned)

//             }).catch((err) => { next(err)})        //books find

//     }).catch((err)=>{next(err)})      // total count of books in db

// }

module.exports.getAllBooks = (req,res,next)=>{                              //query string page,limit
    
    let {page = 1, limit = 10} = req.query;

    BookModel.aggregate([
        {$lookup:{
            from:"categories",
            localField: 'category',
            foreignField: '_id',
            as: 'category',
        }},{$lookup:{
            from:"writers",
            localField: 'writer',
            foreignField: '_id',
            as: 'writer',
        }},
        {$lookup:{
            from:"reviews",
            localField: '_id',
            foreignField: 'book_id',
            as: 'reviews',
        }},{
            $project:{"reviews.book_id":0,"reviews.review_date":0,"reviews.user_id":0,"reviews._id":0,
                        "category.icon":0,"category._id":0,
                        "writer.image":0,"writer.date_addition":0,"writer._id":0}
        }
    ]).limit(limit).skip((page - 1)*limit)
        .then((data) => {
            BookModel.countDocuments().then((count)=>{
                let returned = {
                    n_results : count,
                    n_pages : Math.ceil(count/limit),
                    page,
                    data
                }
                res.status(200).json(returned)
            }).catch((err)=>{next(err)})
        })
        .catch((err) => {
            next(err)
        })  
  }

module.exports.getBookById = (req,res,next)=>{
    // BookModel.findOne({_id:req.params.bookId}).populate({path:"category"}).populate({path:"writer"})
    BookModel.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(req.params.bookId)}
        },
        {$lookup:{
            from:"categories",
            localField: 'category',
            foreignField: '_id',
            as: 'category',
        }},{$lookup:{
            from:"writers",
            localField: 'writer',
            foreignField: '_id',
            as: 'writer',
        }},
        {$lookup:{
            from:"reviews",
            localField: '_id',
            foreignField: 'book_id',
            as: 'reviews',
        }},{
            $project:{"reviews.book_id":0,
                        "category.icon":0,
                        "writer.image":0,"writer.date_addition":0}
        }
    ]).then((data) => {
            if(data.length == 0){
            next(new Error("book is not found"));
            }else{
                res.status(200).json(data);
            }

        })
        .catch((err) => {
            next(err);
        })
}

module.exports.deleteBook = (req,res,next)=>{
   
    BookModel.deleteOne({_id:req.params.bookId})
        .then((data) => {
            if(data.deletedCount == 0){
                next(new Error("book is not found"));
            }else{
                res.status(200).json(data);
            }
        })
        .catch((err) => {
            next(err);
        })
}

module.exports.addBook = (req,res,next)=>{
    const categories = JSON.parse(req.body.category)
    const writers = JSON.parse(req.body.writer)
    
    // console.log(typeof req.body.category)
    const book = new BookModel({
        title:req.body.title,
        description:req.body.description,
        poster:req.uploadedImage,
        source:req.uploadedSrc,
        date_release:req.body.date,
        lang:req.body.lang,
        n_pages:req.body.pages,
        publisher:req.body.publisher,
        price:req.body.price,
        category:categories,
        writer:writers
    })

    book.save()
        .then((data) => {
            res.status(201).json({data: "added"})
        })
        .catch( (err) => {
            console.log(err)
            next(err)
        })
}

//I've just used to add many books for the first time
module.exports.addBooks = (req,res,next)=>{
    BookModel.insertMany(req.body.books)
            .then((data) => {
                res.status(201).json({data: "added"})
            })
            .catch( (err) => {
                console.log(err)
                next(err)
            })

    
}

module.exports.updateBook = (req,res,next)=>{
 
    BookModel.updateOne({_id:req.params.bookId},{
            $set:{
                title:req.body.title,
                description:req.body.description,
                poster:req.uploadedImage,
                source:req.uploadedSrc,
                date_release:req.body.date,
                lang:req.body.lang,
                n_pages:req.body.pages,
                publisher:req.body.publisher,
                price:req.body.price,
                category:req.body.category,
                writer:req.body.writer
            }
        }).then((data) => {
            if(data.matchedCount == 0){
                next(new Error("book is not found"));
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
}

