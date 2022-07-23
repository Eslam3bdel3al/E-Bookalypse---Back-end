//   models
const { findOneAndUpdate } = require('../models/books');
const BookModel = require('../models/books');
const fs = require('fs');

module.exports.getAllBooks = (req,res)=>{
    BookModel.find({}).populate({path:"category"}).populate({path:"writer"})
      .then(book=>{
          res.status(200).send({book})
      })
    //   res.send("aaa")
    //   res.end()    
  }

module.exports.getBookById = (req,res)=>{
    BookModel.findOne({_id:req.params.bookId}).populate({path:"category"}).populate({path:"writer"})
    .then(book=>{
        res.status(200).send({book})
    })
}

module.exports.deleteBook = (req,res)=>{
    // console.log(req.params.bookId)
   
    BookModel.deleteOne({_id:req.params.bookId})
    .then(book=>{
        res.status(200).send({book})
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
        writer:req.body.writer,



    })

    book.save();
    // console.log(req.file)
    // console.log("image"+req.uploadedImage)

    // console.log(req.mypath)
    // console.log(req.file)

    


    res.send("ok")
    // res.sendStatus(201).json({message:"book Added"});

}

module.exports.updateBook = (req,res)=>{
    // console.log(req.params.bookId)
    // console.log(req.body)
    // console.log(req.bookimage)
    
    // if(req.uploadedImage !== undefined){
    //     const myPath = "./public/uploads/books/";
   
    //         req.body.poster = req.uploadedImage
    //     if(req.body.oldImg !== 'undefined'){

    //         fs.unlinkSync(myPath+req.body.oldImg )
    //     }
   

    // }
    if(req.uploadedSrc !== undefined){
        req.body.source = req.uploadedSrc
    }
    if(req.uploadedImage !== undefined){
        req.body.poster = req.uploadedImage
    }
    BookModel.updateOne({_id:req.params.bookId},req.body,
    (err,docs)=>{
        if(err){
            console.log(err)
        }else{
            console.log("updated docs "+ docs)
        }
    }
    
    )
    // console.log(req.body)
    res.send("ok")

}

