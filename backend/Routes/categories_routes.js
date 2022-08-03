const express = require("express");

const categoriesController = require("../controllers/categoriesController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

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

router.route('/api/categorie/:catId')
      .get(categoriesController.getCategory)

router.route('/api/admin/categorie')
// authMW,role.mustAdmin
      .post( authMW,role.mustAdmin, upload.single("catimage"),categoriesData,addImageToFirebase,categoriesController.addCategory)

,
router.route('/api/admin/categorie/:catId')
      // authMW,role.mustAdmin,
      .delete( categoriesData,deleteImageFromFirebase,categoriesController.deleteCategory)
      .put( upload.single("catimage"),categoriesData,updateImageFromFirebase,categoriesController.updateCategory)

module.exports = router; 