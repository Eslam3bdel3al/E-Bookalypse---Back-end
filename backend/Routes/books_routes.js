const express = require('express');
const { getAllBooks, getBookById, addBook, deleteBook, updateBook } = require('../controllers/booksController');

const multer = require('multer');
const  {body,param,query} = require('express-validator');
const ValidationMW = require('../middlewares/ValidationMW');
const { imageHandlingMW } = require('../middlewares/ImageHandlineMW');
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
      .post(upload.single('bookimage'),bookValidations,ValidationMW,bookData,imageHandlingMW,addBook)

router.route('/api/books/:bookId')
      .get(getBookById)
      .put(upload.single('bookimage'),bookValidations,ValidationMW,bookData,imageHandlingMW,updateBook)
      .delete(deleteBook)
      

module.exports = router;