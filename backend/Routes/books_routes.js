const express = require('express');
const multer = require('multer');

const booksController = require('../controllers/booksController');

const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const bookVal = require("../middlewares/validation/book.val")
const validationMw = require("../middlewares/validationMw");

const { addFilesToFirebase, updateFilesToFirebase, deleteFilesFromFireBase } = require('../middlewares/bookFiles');

const router= express.Router();

const upload = multer();

  const bookData = (req,res,next)=>{
      req.mypath = "/uploads/books/poster"
      next()    
  }




router.route('/books-count')
   .get(booksController.getBooksCount) 

router.route('/books-total')
      .get(booksController.getBooksTotal) 

router.route('/books')
      .get(booksController.getAllBooks) 

router.route('/book/:bookId')
      .get(bookVal.bookParam, validationMw, booksController.getBookById)
      .put(authMW, role.mustAdmin, upload.fields([{name:"bookimage"},{name:"booksrc"}]),bookVal.bookEdit, validationMw,bookData,updateFilesToFirebase,booksController.updateBook)
      .delete(authMW, role.mustAdmin, bookVal.bookParam, validationMw, deleteFilesFromFireBase,booksController.deleteBook)

router.route('/book')       
      .post(authMW, role.mustAdmin,upload.fields([{name:"bookimage"},{name:"booksrc"}]),bookVal.bookAdd, validationMw,bookData,addFilesToFirebase,booksController.addBook)
      // .post(booksController.addBooks)
    
// router.route('/api/admin/books')
//       .put(booksController.updatePoster)

module.exports = router;