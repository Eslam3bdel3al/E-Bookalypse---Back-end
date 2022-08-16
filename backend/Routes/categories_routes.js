const express = require("express");
const multer = require('multer');


const categoriesController = require("../controllers/categoriesController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const catVal = require("../middlewares/validation/category.val");
const validationMw = require("../middlewares/validationMw");

const { addImageToFirebase,updateImageFromFirebase,deleteImageFromFirebase } = require('../middlewares/imageFIREBASE');

const router = express.Router();
const upload = multer();


const categoriesData = (req,res,next)=>{
      req.mypath = "uploads/categories/"
      next()  
}

router.route('/categories')
      .get(categoriesController.getAllCategories)


router.route('/categorie')
      .post(authMW,role.mustAdmin, upload.single("catimage"),catVal.categoryAdd, validationMw, categoriesData, addImageToFirebase,categoriesController.addCategory)

,
router.route('/categorie/:catId')
      .get(catVal.catParam, validationMw, categoriesController.getCategory)
      .delete(authMW,role.mustAdmin,catVal.catParam, validationMw, categoriesData,deleteImageFromFirebase,categoriesController.deleteCategory)
      .put(authMW,role.mustAdmin, upload.single("catimage"),catVal.categoryEdit, validationMw,categoriesData,updateImageFromFirebase,categoriesController.updateCategory)

module.exports = router; 