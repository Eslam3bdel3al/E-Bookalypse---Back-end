const mongoose = require("mongoose");

const promotionScema = mongoose.Schema({
    title: {type: String, required: true, unique:true },
    description:{type:String},
    discount_rate:{type:Number,required:true},
    start_date:{type:Date,required:true},
    end_date:{type:Date,required:true},
});

module.exports = mongoose.model("promotions",promotionScema)