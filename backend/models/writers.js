const mongoose = require("mongoose");

const writerScema = mongoose.Schema({
    name:{type: String,required: true,unique:true},
    image:{type:String,default:"user.jpg"},
    date_birth:{type:String},
    place_birth:{type:String},
    bio:{type:String},
    gender:{type:String},
    date_addition: {type:Date, required:true, default: Date.now}
}) 

module.exports = mongoose.model("writers",writerScema)