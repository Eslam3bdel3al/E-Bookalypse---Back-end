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


  /**
  * @swagger
  * tags:
  *   name: Books
  *   description: The books managing API
  */

  /**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *         poster:
 *           type: string
 *         writer:
 *           type: array
 */

  /**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *         500:
 *           description: The list of the books              
 */

  /**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Returns book
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *         500:
 *           description: The list of the books              
 */


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