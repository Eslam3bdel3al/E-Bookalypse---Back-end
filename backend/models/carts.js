const mongoose = require('mongoose');

const book = require("./books");
const user = require("./users")

const cartSchema = mongoose.Schema({
   user_id:{type:mongoose.ObjectId,ref: "user", required: true},
   book: {type:mongoose.ObjectId, ref: "book", required:true },
   date_addition: {type:Date, required:true, default: Date.now}
})


module.exports = mongoose.model('carts', cartSchema);