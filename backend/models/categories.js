const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title : 
    {
        type: String,
        required: true,
        unique:true
    },
    icon:{type:String,default: "noimage.png"},

})


module.exports = mongoose.model('categories', categorySchema);