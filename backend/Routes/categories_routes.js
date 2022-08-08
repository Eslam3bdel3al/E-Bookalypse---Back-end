const express = require("express");
const multer = require('multer');


const categoriesController = require("../controllers/categoriesController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const { addImageToFirebase,updateImageFromFirebase,deleteImageFromFirebase } = require('../middlewares/imageFIREBASE');

const router = express.Router();
const upload = multer();


const categoriesData = (req,res,next)=>{
      req.mypath = "uploads/categories/"
      next()  
}

router.route('/categories')
      .get(categoriesController.getAllCategories)

router.route('/categorie/:catId')
      .get(categoriesController.getCategory)

router.route('/categorie')
      .post(authMW,role.mustAdmin, upload.single("catimage"),categoriesData,addImageToFirebase,categoriesController.addCategory)

,
router.route('/categorie/:catId')
      .delete(authMW,role.mustAdmin, categoriesData,deleteImageFromFirebase,categoriesController.deleteCategory)
      .put(authMW,role.mustAdmin, upload.single("catimage"),categoriesData,updateImageFromFirebase,categoriesController.updateCategory)

module.exports = router; 