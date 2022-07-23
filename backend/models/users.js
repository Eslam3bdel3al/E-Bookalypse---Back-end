const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   fName:{type: String, required: true, match:/^[a-zA-z]+$/},
   lName:{type: String, required: true, match:/^[a-zA-z]+$/},
   date_birth:{type:Date,required:true},
   gender:{type: String, required: true, enum:["male", "female"]},
   street:{type: String, required: true},
   city:{type: String, required: true},
   governorate:{type: String, required: true},
   image:{type:String ,default:"user.png"},
   points:{type:Number, default:0},
   userName:{type: String, required: true, unique:true, match:/^[_a-zA-Z0-9]+$/},
   email:{type: String, required: true, unique:true},
   phone:{type: String, required: true, unique:true, match:/^010[0-9]{8}$|011[0-9]{8}$|012[0-9]{8}$|015[0-9]{8}$/},
   pass:{type: String, required: true},
   role: {type:String, required: true, enum:["rootAdmin", "admin", "regUser"], default: "regUser"},
   date_joined: {type:Date, required:true, default: Date.now}
})


module.exports = mongoose.model('users', userSchema);