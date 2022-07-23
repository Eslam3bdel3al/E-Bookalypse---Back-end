const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");


module.exports.getAllLogs = (req,res,next) => {

    try{
        res.json(fs.readFileSync(path.join(__dirname,`../logs/access${req.params.date}.log`)).toString());
    }
    catch (err){
        next(err)
    }
    

    // .then( (data) => {
    //     console.log(data)
    //     res.status(200).json(data);
    // }).catch((err) => {
    //     res.json("a7a")
    //     console.log(err)
    // })


    // cart.find({user_id: mongoose.Types.ObjectId(req.params.userId)})
    //     .then((data) => {
    //         if(data == null){
    //             next(new Error("No items in user's cart"))
    //         } else {
    //             res.status(200).json(data)
    //         }
    //     })
    //     .catch((err) => {
    //         next(err);
    //     })
};