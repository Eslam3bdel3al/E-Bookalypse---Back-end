const express = require('express');
const  {body,param,query} = require('express-validator');
const multer = require('multer');



const booksController = require('../controllers/booksController');

const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const { imageHandlingMW } = require('../middlewares/ImageHandlineMW');
const { addFilesToFirebase, updateFilesToFirebase, deleteFilesFromFireBase } = require('../middlewares/bookFiles');
const { deleteImageFromFirebase } = require('../middlewares/imageFIREBASE');

const router= express.Router();

const upload = multer();

  const bookData = (req,res,next)=>{
      

      req.mypath = "/uploads/books/poster"
      next()
    
     
  }

router.route('/api/books')
      .get(booksController.getAllBooks) 

router.route('/api/admin/book/:bookId')
      .get(booksController.getBookById)

router.route('/api/admin/book')
// authMW, role.mustAdmin,       
      .post(authMW, role.mustAdmin,upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,addFilesToFirebase,booksController.addBook)
      // .post(booksController.addBooks)

router.route('/api/admin/books/:bookId')
// authMW, role.mustAdmin, 
      .put(authMW, role.mustAdmin,upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,updateFilesToFirebase,booksController.updateBook)
      // .delete(authMW, role.mustAdmin, booksController.deleteBook)
      .delete(authMW, role.mustAdmin,deleteFilesFromFireBase,booksController.deleteBook)

// router.route('/api/admin/books')
//       .put(booksController.updatePoster)

module.exports = router;