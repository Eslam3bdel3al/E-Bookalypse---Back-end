const express = require("express");

const writersController = require("../controllers/writersController")

const router = express.Router();
const multer = require('multer');

const  {body,param,query} = require('express-validator');
const validationMw = require("../middlewares/validationMw");
const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");

const upload = multer();


const writerValidation = [
      body("name").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
      body("gender").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),

]
const writerPath = (req,res,next)=>{
      const {
        file
       } = req
  
       if(file){
        req.mypath = "./public/uploads/writers/"
        next()
       }else{
        next()
       }
       
    }

router.route('/api/writers')
      .get(writersController.getAllWriters)
      .post(upload.single("writerimage"),writerValidation,validationMw,writerPath,imageHandlingMW,writersController.addWriters)



router.route('/api/writers/:writerId')
      .get(writersController.getWriterById)
      .put(upload.single("writerimage"),writerValidation,validationMw,writerPath,imageHandlingMW,writersController.updateWriter)
      .delete(writersController.deleteWriter)


module.exports = router; 