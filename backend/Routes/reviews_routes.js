const express = require("express");

const reviewsController = require("../controllers/reviewsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const reviewVal = require("../middlewares/validation/review.val");
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/user-reviews/:userId?")              //get all reviews of the user
    .get(authMw,reviewVal.userReviews, validationMw, reviewsController.getAllUserReviews)

router.route("/book-reviews/:bookId")              //get all reviews of the book
    .get(reviewVal.bookReviews,validationMw, reviewsController.getAllBookReviews)
    
router.route("/review/:reviewId")
    .get(reviewVal.getDelete,validationMw, reviewsController.getOneReview)
    .put(authMw, role.mustUser,reviewVal.reviewEdit,validationMw, reviewsController.updateReview) 
    .delete(authMw, role.userORAdmin, reviewsController.deleteReview)

router.route("/review")  
         .post(authMw, role.mustUser,reviewVal.reviewAdd,validationMw, reviewsController.addReview)
        

module.exports = router; 