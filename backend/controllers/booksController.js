//   models
const BookModel = require('../models/books');

module.exports.getAllBooks = (req,res)=>{
    BookModel.find({}).populate({path:"category"}).populate({path:"writer"})
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err)
        })  
  }

module.exports.getBookById = (req,res)=>{
    BookModel.findOne({_id:req.params.bookId}).populate({path:"category"}).populate({path:"writer"})
        .then((data) => {
            if(data == null){
            next(new Error("book is not found"));
            }else{
                res.status(200).json(data);
            }

        })
        .catch((err) => {
            next(err);
        })
}

module.exports.deleteBook = (req,res)=>{
   
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

module.exports.addBook = (req,res)=>{

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
        category:req.body.category,
        writer:req.body.writer
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

