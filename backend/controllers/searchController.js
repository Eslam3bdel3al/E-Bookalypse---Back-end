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

    let {page = 1, limit = 10, searchIn = "books"} = req.query;
    
    if(searchIn == "books"){
        books.aggregate([
            {
                $match:{title:{$regex:req.params.key,$options:"i"}}
            },{
            $facet:{
                count:[{ $count: "count" }],
                sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
            }
            }
        ]).then((data)=>{
            if(data[0].count.length == 0){
                next(new Error("no search results"));
            }else{
            let returned = {
                n_results : data[0].count[0].count,
                n_pages : Math.ceil(data[0].count[0].count/parseInt(limit)),
                page:parseInt(page),
                data: data[0].sample
            }
            res.status(200).json(returned)
            }
        }
        )
        .catch((err) => {next(err)})
    } else if (searchIn == "writers") {
        writers.aggregate([
            {
                $match:{name:{$regex:req.params.key,$options:"i"}}
            },{
            $facet:{
                count:[{ $count: "count" }],
                sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
            }
            }
        ]).then((data)=>{
            if(data[0].count.length == 0){
                next(new Error("no search results"));
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
        .catch((err) => {next(err)})
    } else if (searchIn == "promotions") {
        promotions.aggregate([
            {
                $match:{title:{$regex:req.params.key,$options:"i"}}
            },{
            $facet:{
                count:[{ $count: "count" }],
                sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   //,
            }
            }
        ]).then((data)=>{
            if(data[0].count.length == 0){
                next(new Error("no search results"));
            }else{
            let returned = {
                n_results : data[0].count[0].count,
                n_pages : Math.ceil(data[0].count[0].count/parseInt(limit)),
                page:parseInt(page),
                data: data[0].sample
            }
            res.status(200).json(data)
            }
        }
        )
        .catch((err) => {next(err)})
    } else if (searchIn == "users") {
        users.aggregate([
            {
                $match:{userName:{$regex:req.params.key,$options:"i"}}
            },{
            $facet:{
                count:[{ $count: "count" }],
                sample: [{$skip: (parseInt(page) - 1)*parseInt(limit) },{$limit: parseInt(limit)}]   
            }
            }
        ]).then((data)=>{
            if(data[0].count.length == 0){
                next(new Error("no search results"));
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
        .catch((err) => {next(err)})
    }
        
};

