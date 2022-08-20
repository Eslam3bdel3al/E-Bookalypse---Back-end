const mongoose = require('mongoose');



const reviewSchema = mongoose.Schema({
    user_id:{type:mongoose.ObjectId,ref:"users",require:true},
    book_id:{type:mongoose.ObjectId,ref:"books",require:true},
    comment:{type: String},
    vote:{type:Number,min:1,max:5,required:true},
    review_date:{type:Date,required:true, default: Date.now},
})


module.exports = mongoose.model('reviews', reviewSchema);