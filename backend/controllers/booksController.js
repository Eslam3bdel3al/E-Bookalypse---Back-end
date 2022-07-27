//   models
const BookModel = require('../models/books');

module.exports.getAllBooks = (req,res,next)=>{
    BookModel.find({}).populate({path:"category"}).populate({path:"writer"})
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err)
        })  
  }

module.exports.getBookById = (req,res,next)=>{
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

module.exports.deleteBook = (req,res,next)=>{
    // console.log(req.query)
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
    console.log(req.body)
    console.log(req.files)
    const categories = JSON.parse(req.body.category)
    const writers = JSON.parse(req.body.writer)

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
                category:categories,
                writer:writers
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

