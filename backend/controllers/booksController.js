const mongoose = require("mongoose")

const BookModel = require('../models/books');
const reviews = require ("../models/reviews")


module.exports.getAllBooks = (req,res,next)=>{                              //query string page,limit
    
    //destructing query string
    let {page = 1, limit = 10, category, rate , priceMin, priceMax , priceSort} = req.query;

    // to handle filtering an objects to be set in the aggregate function below
    let match = {};
    let sort = {};

    if (category){
        if(typeof(category) == "string"){
            match["category.title"] = category
        } else {
            match["category.title"] = {$in:category}
        }
    }

    if (rate){
        match["rate"] = {$gte:parseInt(rate)}
    }

    if(priceMin && priceMax){
        match["price"] = {$gte:parseInt(priceMin),$lte:parseInt(priceMax)}
    } else if (priceMin) {
        match["price"] = {$gte:parseInt(priceMin)}
    } else if (priceMax){
        match["price"] = {$lte:parseInt(priceMax)}
    }

    if(priceSort){
    
        if (priceSort == "lth"){
            sort["price"] = 1
        } else if (priceSort == "htl"){
            sort["price"] = -1
        }
    }else{

        sort["_id"]=1
    }

   

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
        }},
        {$lookup:{
            from:"promotions",
            localField: 'promotion',
            foreignField: '_id',
            as: 'promotion',
        }},
        {$lookup:{
            from:"orders",
            localField: '_id',
            foreignField: 'order_books',
            as: 'orders',
        }},
        {
            //first prjection to get votes count from reviews array outputed from prev lookup
            $project:{
                "title":1,"description":1,"poster":1,"date_release":1,"lang":1,"n_pages":1,"publisher":1,"price":1,
                "category.title":1,"category._id":1,"writer.name":1,"writer._id":1,"promotion":1,
                "ratesCount": { $size:"$reviews"},
                "fivesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 5]}}}},
                "foursCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 4]}}}},
                "threesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 3]}}}},
                "twosCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 2]}}}},
                "onesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 1]}}}},
                "sales":{$size:{$filter:{"input" : "$orders","as" : "obj","cond": { "$eq" : ["$$obj.state", "accepted"]}}}}
            } 
        },
        {
            //second projection to get calc rate
            $project:{
                "title":1,"description":1,"poster":1,"date_release":1,"lang":1,"n_pages":1,"publisher":1,"price":1,
                "category.title":1,"category._id":1,"writer.name":1,"writer._id":1,"promotion":1,"sales":1,
                "ratesCount":1,
                "rate": {
                        $cond:    //can't devide by zero so check if ratesCount not equal zero
                            [
                                { "$eq" : ["$ratesCount", 0]},
                                0,
                                {$divide:[{$add:[{$multiply:["$fivesCount",5]},{$multiply:["$foursCount",4]},
                                                {$multiply:["$threesCount",3]},{$multiply:["$twosCount",2]},"$onesCount"]},
                                                "$ratesCount"]}
                            ]
                        }
            } 
        },
        {
            // $match:{"category.title":{$in:["kids"]},"rate":{$gte:2}}
            $match: match
        },
        {
            $sort: sort
        },
        {
            $facet:{
                count:[{ $count: "count" }],
                sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
            }
        }
    ])
    .then((data) => {
        if(data[0].count.length == 0){
            console.log(data[0])
            next(new Error("no results"));
        }else{
        let returned = {
            n_results : data[0].count[0].count,
            n_pages : Math.ceil(data[0].count[0].count/parseInt(limit)),
            page:parseInt(page),
            data: data[0].sample
        }
        res.status(200).json(returned)
        }
    })
    .catch((err) => {
        next(err)
    })  
  }

module.exports.getBookById = (req,res,next)=>{
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

