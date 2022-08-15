const express = require("express");
const multer = require('multer');

const usersController = require("../controllers/usersController");
const userVal = require("../middlewares/validation/user.val")
const validationMw = require("../middlewares/validationMw");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");
const { addImageToFirebase, updateImageFromFirebase, deleteImageFromFirebase } = require("../middlewares/imageFIREBASE");

const router = express.Router();
const upload = multer();

const userData = (req,res,next)=>{
        req.mypath = "uploads/users/"
        next()  
}

router.route("/signUp")
        .post(upload.single('userImage'),userVal.userAdd, validationMw, userData,addImageToFirebase,usersController.userSignUp)


router.route("/users")
        .get(authMW, role.mustAdmin,usersController.getAllusers) 

router.route("/admins")
        .get(authMW, role.mustAdmin,usersController.getAdmins) 

// router.route("/api/admin/user")
//         .put(authMW, role.mustAdmin, valArrays.userAdd, validationMw, usersController.updateUser)

router.route("/user/:userId?")                       
        .get(authMW,role.userORAdmin, usersController.getUserById) 

router.route("/user") 
        .put(authMW,upload.single('userImage'),userVal.userEdit, validationMw,userData,updateImageFromFirebase, usersController.updateUser)
        .delete(authMW,userData,deleteImageFromFirebase, usersController.deleteUser)



router.route("/user-pass")
        .put(authMW, userVal.userChagePass, validationMw, usersController.changePass)      //body {currentPass,newPass}

router.route("/user-change-role")
        .put(authMW, role.mustRootAdmin,userVal.userRole, validationMw, usersController.updateRole)

router.route("/forget-pass-mail")
      .post(userVal.forgetSendMail, validationMw,usersController.forgetSendMail)

router.route("/forget-pass-change")
        .patch(authMW,userVal.forgetPassChange, validationMw, usersController.forgetChangePass)

module.exports = router;