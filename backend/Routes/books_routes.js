const express = require('express');
const { getAllBooks, getBookById, addBook, deleteBook, updateBook } = require('../controllers/booksController');

const multer = require('multer');
const  {body,param,query} = require('express-validator');
const validationMw = require("../middlewares/validationMw");
const { imageHandlingMW } = require('../middlewares/ImageHandlineMW');
const { addFilesToFirebase, updateFilesToFirebase } = require('../middlewares/bookFiles');
const router= express.Router();



  const upload = multer();


  const bookValidations = [
    body("title").isString().withMessage("should be Letters only").notEmpty().withMessage("This Field is required"),
    body("price").isNumeric().withMessage("Book Price Must Number").notEmpty().withMessage("This Field is required"),
    body("description").isString().withMessage("you must have a book description").notEmpty().withMessage("This Field is required"),
    
  ]

  const bookData = (req,res,next)=>{
    const {
      file
     } = req

     if(file){
      req.mypath = "./public/uploads/books/"
      next()
     }else{
      next()
     }
     
  }

router.route('/api/books')
      .get(getAllBooks)
      .post(upload.fields([{name:"bookimage"},{name:"booksrc"}]),bookValidations,validationMw,bookData,addFilesToFirebase,addBook)

router.route('/api/books/:bookId')
      .get(getBookById)
      .put(upload.fields([{name:"bookimage"},{name:"booksrc"}]),bookValidations,validationMw,bookData,updateFilesToFirebase,updateBook)
      .delete(deleteBook)
      

module.exports = router;