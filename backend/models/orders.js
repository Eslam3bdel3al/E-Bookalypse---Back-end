const mongoose = require('mongoose');

const user = require("../models/users");
const book = require("../models/books");

const orderedBooks = mongoose.Schema({
    id:{type:mongoose.ObjectId, ref:"book", required:true},
    title:{type:String,required:true},
    discountRate:{type:Number,required:true},
    price:{type:Number,required:true},
})

const orderSchema = mongoose.Schema({
    user_id:{type:mongoose.ObjectId,ref:"user",required:true},
    order_books:{type:[orderedBooks],required:true},
    state:{type:String,enum:["pending", "accepted", "rejected"],required:true, default: "pending"},
    date_order:{type:Date,required:true, default: Date.now},
})


module.exports = mongoose.model('orders', orderSchema);