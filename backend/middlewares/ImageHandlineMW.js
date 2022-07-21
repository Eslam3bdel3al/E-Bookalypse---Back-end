const fs = require('fs');
const path = require('path');
const myPath = "./public/uploads/books/";

module.exports.imageHandlingMW =(req,res,next)=>{
    const {file} = req
    // check if file uploaded
   if(file){
    // check the Extension of the file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
      // add the Date To make the filename unique
      fileNewName = Date.now() + "_" + file.originalname 
      
      // convert the file buffer to a string 
      const b64 = Buffer.from(file.buffer).toString('base64');
      // download the file to our server " req . path  = the path for books images"  
      fs.writeFileSync(req.mypath+fileNewName ,b64,'base64');
      // sending the uploaded image (name) to the next middleware to save it in DB 
      req.uploadedImage = fileNewName
      next()
  
    } 
    else{
      // if file not JPG OR PNG
        let err = new Error('File Must be JPG or PNG')
        next(err)
    }
  }else{
    console.log("no file uploaded")
    next()
  }


  
}