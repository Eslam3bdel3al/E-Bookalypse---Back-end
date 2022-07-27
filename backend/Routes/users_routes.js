const express = require("express");

const usersController = require("../controllers/usersController");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const router = express.Router();
const multer = require('multer');
const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");
const { addImageToFirebase, updateImageFromFirebase, deleteImageFromFirebase } = require("../middlewares/imageFIREBASE");
const upload = multer();

const userData = (req,res,next)=>{
    
        req.mypath = "uploads/users/"
        next()
         
      }

router.route("/api/user/signUp")
        .post(upload.single('userImage'),valArrays.userAddEdit, validationMw, userData,addImageToFirebase,usersController.userSignUp)


router.route("/api/admin/users")
// authMW, role.mustAdmin,
        .get(usersController.getAllusers) 

router.route("/api/admin/user")
        .put(authMW, role.mustAdmin, valArrays.userAddEdit, validationMw, usersController.updateUser)

router.route("/api/user/:userId")                       
        .get(authMW, usersController.getUserByUserName)                                                //userName as query string
        // authMW, role.mustUser,
        .put( upload.single('userImage'),valArrays.userAddEdit, validationMw,userData,updateImageFromFirebase, usersController.updateUser)
        // authMW, role.userORAdmin ,
        .delete(userData,deleteImageFromFirebase, usersController.deleteUser)                                 //userName as query string

router.route("/api/admin/changeRole")
        .put(authMW, role.mustRootAdmin,valArrays.userRole, validationMw, usersController.updateRole)


module.exports = router;