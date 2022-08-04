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
        .post(upload.single('userImage'),valArrays.userAdd, validationMw, userData,addImageToFirebase,usersController.userSignUp)


router.route("/api/admin/users")
        .get(authMW, role.mustAdmin,usersController.getAllusers) 

// router.route("/api/admin/user")
//         .put(authMW, role.mustAdmin, valArrays.userAdd, validationMw, usersController.updateUser)

router.route("/api/user/:userId?")                       
        .get(authMW,role.userORAdmin, usersController.getUserById)                                               
        .delete(authMW, role.userORAdmin,userData,deleteImageFromFirebase, usersController.deleteUser)

router.route("/api/user") 
        .put(authMW, role.mustUser,upload.single('userImage'),valArrays.userEdit, validationMw,userData,updateImageFromFirebase, usersController.updateUser)


router.route("/api/user/pass")
        .put(authMW, role.mustUser, valArrays.userChagePass, validationMw, usersController.changePass)      //body {currentPass,newPass}

router.route("/api/admin/changeRole")
        .put(authMW, role.mustRootAdmin,valArrays.userRole, validationMw, usersController.updateRole)



module.exports = router;