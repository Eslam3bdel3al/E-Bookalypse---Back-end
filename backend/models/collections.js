const mongoose = require("mongoose");

const collectionScema = mongoose.Schema({
    title: {type: String, required: true, unique:true },
    description:{type:String},
    collectionPrice:{type:Number,required:true},
    collectionBooks:{type:[mongoose.Types.ObjectId],ref:"books",required:true}
});

module.exports = mongoose.model("collections",collectionScema)