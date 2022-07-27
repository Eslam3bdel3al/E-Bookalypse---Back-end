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

router.route('/api/writers')
      .get(writersController.getAllWriters)

router.route('/api/admin/writer')
//     authMw, role.mustAdmin,
      .post(upload.single("writerimage"),writerValidation,validationMw,writerPath,addImageToFirebase,writersController.addWriter)

router.route('/api/writer/:writerId')
      .get(writersController.getWriterById)

router.route('/api/admin/writer/:writerId')
//     authMw, role.mustAdmin, 
      .put(upload.single("writerimage"),writerValidation,validationMw,writerPath,updateImageFromFirebase,writersController.updateWriter)
      
      // authMw, role.mustAdmin,
      .delete(writerPath,deleteImageFromFirebase, writersController.deleteWriter)


module.exports = router; 