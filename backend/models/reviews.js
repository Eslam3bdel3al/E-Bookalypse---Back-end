const mongoose = require('mongoose');

const user = require("../models/users");
const book = require("../models/books");

const reviewSchema = mongoose.Schema({
    user_id:{type:mongoose.ObjectId,ref:"user",require:true},
    book_id:{type:mongoose.ObjectId,ref:"book",require:true},
    comment:{type: String},
    vote:{type:Number,min:1,max:5,required:true},
    review_date:{type:Date,required:true, default: Date.now},
})


module.exports = mongoose.model('reviews', reviewSchema);