const express = require('express');
const multer = require('multer');



const booksController = require('../controllers/booksController');

const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const { addFilesToFirebase, updateFilesToFirebase, deleteFilesFromFireBase } = require('../middlewares/bookFiles');

const router= express.Router();

const upload = multer();

  const bookData = (req,res,next)=>{
      

      req.mypath = "/uploads/books/poster"
      next()
    
     
  }

router.route('/books')
      .get(booksController.getAllBooks) 

router.route('/book/:bookId')
      .get(booksController.getBookById)
      .put(authMW, role.mustAdmin, upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,updateFilesToFirebase,booksController.updateBook)
      .delete(authMW, role.mustAdmin,deleteFilesFromFireBase,booksController.deleteBook)

router.route('/book')       
      .post(authMW, role.mustAdmin,upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,addFilesToFirebase,booksController.addBook)
      // .post(booksController.addBooks)
    
// router.route('/api/admin/books')
//       .put(booksController.updatePoster)

module.exports = router;