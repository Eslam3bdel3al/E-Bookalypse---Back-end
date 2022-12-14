const writers = require ("../models/writers");
const books = require ("../models/books");
const promotions = require ("../models/promotions");
const users = require ("../models/users");


// module.exports.navSearch = (req,res,next)=>{
//     let resultCount;
//     let {page = 1, limit = 10, searchIn = "all"} = req.query;
    
//     if(searchIn == "all"){
//         writers.find({name:{$regex:req.params.key,$options:"i"}})
//         .limit(limit).skip((page - 1)*limit)
//         .then(async (data) => {
//             let result = await books.find({title:{$regex:req.params.key,$options:"i"}}).exec()
//             return data.concat(result)
//         })
//         .then(async (data)=>{
//             let result = await promotions.find({title:{$regex:req.params.key,$options:"i"}}).exec()
//             return data.concat(result)
//         })
//         .then(async (data)=>{
//             let result = await users.find({userName:{$regex:req.params.key,$options:"i"}}).exec()
//             resultCount = data.concat(result).length;
//             return data.concat(result)
//         })
//         .then((data)=>{
//             let returned = {
//                 n_results : resultCount,
//                 n_pages : Math.ceil(resultCount/limit),
//                 page,
//                 data
//             }
//             res.status(200).json(returned)
//         })
//         .catch((err) => {next(err)})
//     }
        
// };


module.exports.toSearch = (req,res,next)=>{

    let {key = "", page = 1, limit = 6, searchIn = "Books", category, rate , priceMin, priceMax , priceSort} = req.query;
    
    // to handle filtering an objects to be set in the aggregate function below
    let searchMatch = {};
    let filterMatch = {};
    let sort = {};

   
    
    if (searchIn == "Books") {
        searchMatch["title"] = {$regex:key,$options:"i"}
    } 

    if (searchIn == "writers") {
        searchMatch["writer.name"] = {$regex:key,$options:"i"}
    } 

    if (searchIn == "promotions") {
        searchMatch["promotion.title"] = {$regex:key,$options:"i"}
    } 
    


    if(page <= 0 ){
        page = 1
    }

    if(limit <= 0){
        limit = 1
    } 

    if (category){
        if(typeof(category) == "string"){
            filterMatch["category.title"] = category
        } else {
            filterMatch["category.title"] = {$in:category}
        }
    }

    if (rate){
        filterMatch["rate"] = {$gte:parseInt(rate)}
    }

    if(priceMin && priceMax){
        filterMatch["price"] = {$gte:parseInt(priceMin),$lte:parseInt(priceMax)}
    } else if (priceMin) {
        filterMatch["price"] = {$gte:parseInt(priceMin)}
    } else if (priceMax){
        filterMatch["price"] = {$lte:parseInt(priceMax)}
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


    
    if (searchIn == "users") {
        users.aggregate([
            {
                $match:{userName:{$regex:key,$options:"i"}}
            },{
                $skip: (parseInt(page) - 1)*parseInt(limit)  
            },
            {
                $limit: parseInt(limit)
            }
        ]).then((data)=>{
            let returned = {
                page:parseInt(page),
                data
            }
            res.status(200).json(returned)
        })
        .catch((err) => {next(err)})





    } else if (searchIn == "writersNames") {
            writers.aggregate([
                {
                    $match:{name:{$regex:key,$options:"i"}}
                },
                {
                    $project:{name:1}
                },
                {
                    $skip: (parseInt(page) - 1)*parseInt(limit)  
                },
                {
                    $limit: parseInt(limit)
                }
            ]).then((data)=>{
                
                let returned = {
                    page:parseInt(page),
                    data
                }
                res.status(200).json(returned)
            })
            .catch((err) => {next(err)})
        }else {


        books.aggregate([
            {
                $match:searchMatch                         //{"writer.name":{$regex:key,$options:"i"}}
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
                    "sales":{$size:"$orders"}
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
                
                $match: filterMatch
            },
            {
                $sort: sort
            },
            {
                $skip: (parseInt(page) - 1)*parseInt(limit)  //,
            },
            {
                $limit: parseInt(limit)
            }
        ]).then((data)=>{
            let returned = {
                page:parseInt(page),
                data
            }
            res.status(200).json(returned)
        }
        ).catch((err) => {next(err)})
    }
    // else if (searchIn == "writers") {
    //     writers.aggregate([
    //         {
    //             $match:{name:{$regex:key,$options:"i"}}
    //         },{
    //         $facet:{
    //             count:[{ $count: "count" }],
    //             sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
    //         }
    //         }
    //     ]).then((data)=>{
    //         if(data[0].count.length == 0){
    //             next(new Error("no search results"));
    //         }else{
    //         let returned = {
    //             n_results : data[0].count[0].count,
    //             n_pages : Math.ceil(data[0].count[0].count/parseInt(limit)),
    //             page:parseInt(page),
    //             data: data[0].sample
    //         }
    //         res.status(200).json(returned)
    //         }
    //     })
    //     .catch((err) => {next(err)})
    // } else if (searchIn == "promotions") {
    //     promotions.aggregate([
    //         {
    //             $match:{title:{$regex:key,$options:"i"}}
    //         },{
    //         $facet:{
    //             count:[{ $count: "count" }],
    //             sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
    //         }
    //         }
    //     ]).then((data)=>{
    //         if(data[0].count.length == 0){
    //             next(new Error("no search results"));
    //         }else{
    //         let returned = {
    //             n_results : data[0].count[0].count,
    //             n_pages : Math.ceil(data[0].count[0].count/parseInt(limit)),
    //             page:parseInt(page),
    //             data: data[0].sample
    //         }
    //         res.status(200).json(returned)
    //         }
    //     }
    //     )
    //     .catch((err) => {next(err)})
    // }
    // 
        
};

