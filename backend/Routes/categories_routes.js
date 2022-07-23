const express = require("express");

const categoriesController = require("../controllers/categoriesController")
const { imageHandlingMW } = require('../middlewares/ImageHandlineMW');
const { addImageToFirebase,updateImageFromFirebase,deleteImageFromFirebase } = require('../middlewares/imageFIREBASE');

const router = express.Router();

const multer = require('multer');

const upload = multer();


const categoriesData = (req,res,next)=>{
     
      
        req.mypath = "uploads/categories/"
        next()
       
       
       
    }

router.route('/api/categories')
      .get(categoriesController.getAllCategories)
      .post(upload.single("catimage"),categoriesData,addImageToFirebase,categoriesController.addCategory)


router.route('/api/categories/:catId')
      .delete(categoriesData,deleteImageFromFirebase,categoriesController.deleteCategory)
      .put(upload.single("catimage"),categoriesData,updateImageFromFirebase,categoriesController.updateCategory)
      .get(categoriesController.getCategory)


module.exports = router; 