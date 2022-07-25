const mongoose = require('mongoose');

const category = require("../models/categories");
const writer = require("../models/writers");
const promotion = require("../models/promotions")

const writerEmbedded = mongoose.Schema({
    id:{type:mongoose.ObjectId,required:true},
    name:{type:String,required:true}
})

const categoryEmbedded = mongoose.Schema({
    id:{type:mongoose.ObjectId,required:true},
    title:{type:String,required:true}
})

const bookSchema = mongoose.Schema({
    title:{ type: String, required: true, unique:true },
    description :{type: String, required: true},
    poster:{type:String,default: "./book.jpg"},
    source:{type:String},
    date_release:{type: Date},     //markModified in controller
    lang: {type:String},
    n_pages:{type:Number},
    publisher:{type:String},
    price:{type:Number,required:true},
    category:{type:[mongoose.Types.ObjectId],ref:"categories",required:true},
    writer:{type:[mongoose.Types.ObjectId],ref:"writers",required:true},
    promotion:{type:mongoose.ObjectId,ref:"promotion"},
    date_addition: {type:Date, required:true, default: Date.now}
})





module.exports = mongoose.model('books', bookSchema);