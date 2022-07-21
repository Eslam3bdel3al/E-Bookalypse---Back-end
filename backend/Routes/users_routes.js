const express = require("express");

const usersController = require("../controllers/usersController");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const router = express.Router();
const multer = require('multer');
const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");
const upload = multer();

const userData = (req,res,next)=>{
        const {
          file
         } = req
    
         if(file){
          req.mypath = "./public/uploads/users/"
          next()
         }else{
          next()
         }
         
      }

router.route("/api/users/signUp")
        .post(upload.single('userImage'),valArrays.userAddEdit, validationMw, userData,imageHandlingMW,usersController.userSignUp)


router.route("/api/users")
// authMW, role.mustAdmin, 
        .get(usersController.getAllusers)    
        .put(authMW, role.mustAdmin, valArrays.userAddEdit, validationMw, usersController.updateUser)

router.route("/api/users/:userId")                       
        .get(authMW, usersController.getUserByUserName)                                                //userName as query string
        .put(authMW, role.mustUser, valArrays.userAddEdit, validationMw, usersController.updateUser)
        .delete(authMW, role.userORAdmin ,usersController.deleteUser)                                 //userName as query string

router.route("/api/admin/changeRole")
        .put(authMW, role.mustRootAdmin,valArrays.userRole, validationMw, usersController.updateRole)


module.exports = router;