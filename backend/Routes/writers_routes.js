const express = require("express");
const multer = require('multer');

const writersController = require("../controllers/writersController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const writerVal = require("../middlewares/validation/writer.val");
const validationMw = require("../middlewares/validationMw");

const { imageHandlingMW } = require("../middlewares/ImageHandlineMW");
const { addImageToFirebase, deleteImageFromFirebase, updateImageFromFirebase } = require("../middlewares/imageFIREBASE");

const router = express.Router();

const upload = multer();

const writerPath = (req,res,next)=>
      {
            req.mypath = "uploads/writers/"
            next()
      }

router.route('/writers')
      .get(writersController.getAllWriters)

router.route('/writer')    
      .post(authMw, role.mustAdmin,upload.single("writerimage"),writerVal.writerAdd,validationMw,writerPath,addImageToFirebase,writersController.addWriter)

router.route('/writer/:writerId')
      .get(writerVal.writerParam,validationMw, writersController.getWriterById)
      .put(authMw, role.mustAdmin,upload.single("writerimage"),writerVal.writerUpdate,validationMw,writerPath,updateImageFromFirebase,writersController.updateWriter)
      .delete(authMw, role.mustAdmin, writerVal.writerParam, validationMw, writerPath, deleteImageFromFirebase, writersController.deleteWriter)

module.exports = router; 