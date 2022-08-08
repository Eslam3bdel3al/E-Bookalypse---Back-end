const express = require("express");

const writersController = require("../controllers/writersController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();
const multer = require('multer');

const  {body,param,query} = require('express-validator');
const validationMw = require("../middlewares/validationMw");
const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");
const { addImageToFirebase, deleteImageFromFirebase, updateImageFromFirebase } = require("../middlewares/imageFIREBASE");

const upload = multer();


const writerValidation = [
      body("name").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
      body("gender").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),

]
const writerPath = (req,res,next)=>{
      req.mypath = "uploads/writers/"
      next()
       
    }

router.route('/writers')
      .get(writersController.getAllWriters)

router.route('/writer')    
      .post(authMw, role.mustAdmin,upload.single("writerimage"),writerValidation,validationMw,writerPath,addImageToFirebase,writersController.addWriter)

router.route('/writer/:writerId')
      .get(writersController.getWriterById)
      .put(authMw, role.mustAdmin,upload.single("writerimage"),writerValidation,validationMw,writerPath,updateImageFromFirebase,writersController.updateWriter)
      .delete(authMw, role.mustAdmin,writerPath,deleteImageFromFirebase, writersController.deleteWriter)

     


module.exports = router; 