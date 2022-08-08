const express = require("express");

const reviewsController = require("../controllers/reviewsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/user-reviews/:userId?")              //get all reviews of the user
    .get(authMw, reviewsController.getAllUserReviews)

router.route("/book-reviews/:bookId")              //get all reviews of the book
    .get(reviewsController.getAllBookReviews)
    
router.route("/review/:reviewId")
    .get(reviewsController.getOneReview)
    .put(authMw, role.mustUser,valArrays.reviewAddEdit,validationMw, reviewsController.updateReview) 
    .delete(authMw, role.userORAdmin, reviewsController.deleteReview)

router.route("/review")  
         .post(authMw, role.mustUser,valArrays.reviewAddEdit,validationMw, reviewsController.addReview)
        


module.exports = router; 