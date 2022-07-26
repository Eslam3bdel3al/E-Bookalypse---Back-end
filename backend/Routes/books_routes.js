const express = require('express');
const  {body,param,query} = require('express-validator');
const multer = require('multer');



const booksController = require('../controllers/booksController');

const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const { imageHandlingMW } = require('../middlewares/ImageHandlineMW');
const { addFilesToFirebase, updateFilesToFirebase } = require('../middlewares/bookFiles');

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
      // .post(authMW, role.mustAdmin, upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,addFilesToFirebase,booksController.addBook)
      .post(upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,addFilesToFirebase,booksController.addBook)

router.route('/api/admin/books/:bookId')
      // .put(authMW, role.mustAdmin, upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,updateFilesToFirebase,booksController.updateBook)
      .put(upload.fields([{name:"bookimage"},{name:"booksrc"}]),valArrays.bookValidations,validationMw,bookData,updateFilesToFirebase,booksController.updateBook)
      // .delete(authMW, role.mustAdmin, booksController.deleteBook)
      .delete(booksController.deleteBook)
      

module.exports = router;