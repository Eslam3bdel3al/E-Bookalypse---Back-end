const mongoose = require("mongoose")

const Books = require('../models/books');
const Reviews = require('../models/reviews');
const Collections = require('../models/collections');
const Users = require('../models/users');


module.exports.getBooksCount = (req,res, next)=>{
    Books.find({}).count()
    .then((data) => {
        res.status(200).json({count:data})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.getBooksTotal = (req,res, next)=>{
    Books.find({},{title:1})
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.getAllBooks =  (req,res,next)=>{                              //query string page,limit
    
    //destructing query string
    let {page = 1, limit = 6, category, rate , priceMin, priceMax , priceSort,salesSort, lang = "en"} = req.query;

    // to handle filtering an objects to be set in the aggregate function below
    let match = {};
    let sort = {};

    if(page <= 0 ){
        page = 1
    }

    if(limit <= 0){
        limit = 1
    } 

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

    if (lang){
        if (lang == "en")
        {
            match["lang"] = "english"
        } else if (lang == "ar")
        {
            match["lang"] = "عربي"
        }
    }

    if(priceSort){
        delete sort._id;
        if (priceSort == "lth"){
            sort["price"] = 1
        } else if (priceSort == "htl"){
            sort["price"] = -1
        }
    }else{
        sort["_id"]=1
    }

    if(salesSort){
        delete sort._id;
        if (salesSort == "lth"){
            sort["sales"] = 1
        } else if (salesSort == "htl"){
            sort["sales"] = -1
        }
    }else{
        sort["_id"]=1
    }
   

    Books.aggregate([
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
                "sales":{$size:"$orders"}                     //{$filter:{"input" : "$orders","as" : "obj","cond": { "$eq" : ["$$obj.state", "accepted"]}}}}
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
            $skip: (parseInt(page) - 1)*parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }   
    ])
    .then((data) => {

            let returned = {
                page:parseInt(page),
                data
            }
            res.status(200).json(returned)
    })
    .catch((err) => {
        next(err)
    })  
  }

module.exports.getBookById = (req,res,next)=>{
    Books.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(req.params.bookId)}
        },{$lookup:{
            from:"promotions",
            localField: 'promotion',
            foreignField: '_id',
            as: 'promotion',
        }},
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
            from:"orders",
            localField: '_id',
            foreignField: 'order_books',
            as: 'orders',
        }},
        {
            //first prjection to get votes count from reviews array outputed from prev lookup
            $project:{
                "title":1,"description":1,"poster":1,"date_release":1,"lang":1,"n_pages":1,"publisher":1,"price":1,
                "category.title":1,"category._id":1,"writer.name":1,"writer._id":1,"promotion":1,"date_addition":1,"reviews":1,
                "ratesCount": { $size:"$reviews"},
                "fivesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 5]}}}},
                "foursCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 4]}}}},
                "threesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 3]}}}},
                "twosCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 2]}}}},
                "onesCount":{$size:{$filter:{"input" : "$reviews","as" : "obj","cond": { "$eq" : ["$$obj.vote", 1]}}}},
                "sales":{$size:"$orders"}                     //{$filter:{"input" : "$orders","as" : "obj","cond": { "$eq" : ["$$obj.state", "accepted"]}}}}
            } 
        },
        {
            //second projection to get calc rate
            $project:{
                "title":1,"description":1,"poster":1,"date_release":1,"lang":1,"n_pages":1,"publisher":1,"price":1,
                "category.title":1,"category._id":1,"writer.name":1,"writer._id":1,"promotion":1,"date_addition":1,"reviews":1,"sales":1,
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
        }
    ]).then((data) => {
            if(data.length == 0){
                let err = new Error("book is not found");
                err.status = 404;
                throw err
            }else{
                res.status(200).json(data);
            }

        })
        .catch((err) => {
            next(err);
        })
}

module.exports.deleteBook = (req,res,next)=>{
    let {bookId} = req.params
    Books.deleteOne({_id:mongoose.Types.ObjectId(bookId)})
        .then(async (data) => {
            if(data.deletedCount == 0){
                let err = new Error("book is not found");
                err.status = 404;
                throw err
            }else{
                await Collections.updateOne({collectionBooks:mongoose.Types.ObjectId(bookId)},{
                    $pull:{collectionBooks:mongoose.Types.ObjectId(bookId)}
                })
                await Reviews.deleteOne({book_id:mongoose.Types.ObjectId(bookId)})
                await Users.updateOne({$or:[{book_shelf:mongoose.Types.ObjectId(bookId)},{"cart.bookItems":mongoose.Types.ObjectId(bookId)},{"wishList.bookItems":mongoose.Types.ObjectId(bookId)}]},{
                    $pull:{"cart.bookItems":mongoose.Types.ObjectId(bookId),
                            "wishList.bookItems":mongoose.Types.ObjectId(bookId),
                            book_shelf:mongoose.Types.ObjectId(bookId)}
                })
                res.status(200).json({data:"deleted"});
            }
        })
        .catch((err) => {
            next(err);
        })
}

module.exports.addBook = (req,res,next)=>{
    const categories = JSON.parse(req.body.category)
    const writers = JSON.parse(req.body.writer)
    
    const book = new Books({
        title:req.body.title,
        description:req.body.description,
        poster:req.uploadedImage,
        source:req.uploadedSrc,
        date_release:req.body.date,
        lang:req.body.lang,
        n_pages:req.body.pages,
        publisher:req.body.publisher,
        price:req.body.price,
        promotion:req.body.promotion,
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
    Books.insertMany(req.body.books)
            .then((data) => {
                res.status(201).json({data: "added"})
            })
            .catch( (err) => {
                console.log(err)
                next(err)
            })

    
}

module.exports.updateBook = (req,res,next)=>{
    let secondParam = {};
    if (req.body.promotion == "remove"){
        secondParam["$set"] = {
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
        secondParam["$unset"] = {
            promotion: 1 
        }
    } else {
        secondParam["$set"] = {
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
        writer:writers,
        promotion:req.body.promotion
        }
    }

    const categories = JSON.parse(req.body.category)
    const writers = JSON.parse(req.body.writer)
    Books.updateOne({_id:req.params.bookId},
        // {
        //     $set:{
        //         title:req.body.title,
        //         description:req.body.description,
        //         poster:req.uploadedImage,
        //         source:req.uploadedSrc,
        //         date_release:req.body.date,
        //         lang:req.body.lang,
        //         n_pages:req.body.pages,
        //         publisher:req.body.publisher,
        //         price:req.body.price,
        //         category:categories,
        //         writer:writers,
        //         promotion:req.body.promotion
        //     }
        // }
        secondParam
        ).then((data) => {
            if(data.matchedCount == 0){
                let err = new Error("book is not found");
                err.status = 404;
                throw err
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })
}



//used to update all posters 
module.exports.updatePoster = (req,res,next)=>{
   
    Books.updateMany({},{
            $set:{
                poster:"book.png",
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
