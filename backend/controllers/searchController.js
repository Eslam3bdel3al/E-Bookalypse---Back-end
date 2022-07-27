const writers = require ("../models/writers");
const books = require ("../models/books");
const promotions = require ("../models/promotions");
const users = require ("../models/users");


module.exports.navSearch = (req,res,next)=>{
    let {page = 1, limit = 10} = req.query;

    writers.find({name:{$regex:req.params.key,$options:"i"}})
        .then((writersResult) => {

            books.find({title:{$regex:req.params.key,$options:"i"}})
            .then((booksResult)=>{

                promotions.find({title:{$regex:req.params.key,$options:"i"}})
                .then((promotionsResult)=>{
    
                    users.find({userName:{$regex:req.params.key,$options:"i"}})
                    .then((usersResult)=>{

                        res.status(200).json({writers:writersResult, books:booksResult, promotions:promotionsResult, users:usersResult });

                    }).catch((err) => {next(err)})   //users then
    
    
                }).catch((err) => {next(err)})   //promotions then


            }).catch((err) => {next(err)})   //books then

            }).catch((err) => {next(err)})  // writers then
};

