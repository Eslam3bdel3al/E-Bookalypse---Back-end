const express = require("express");

const reviewsController = require("../controllers/reviewsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/api/reviews/user/:userId?")              //get all reviews of the user
    .get(authMw, reviewsController.getAllUserReviews)

router.route("/api/reviews/book/:bookId")              //get all reviews of the book
    .get(reviewsController.getAllBookReviews)
    
router.route("/api/review/:reviewId")
    .get(reviewsController.getOneReview)

router.route("/api/user/review/reviewId")             
         .delete(authMw, role.userORAdmin, reviewsController.deleteReview)

router.route("/api/user/review")  
         .post(authMw, role.mustUser,valArrays.reviewAddEdit,validationMw, reviewsController.addReview)
         .put(authMw, role.mustUser,valArrays.reviewAddEdit,validationMw, reviewsController.updateReview)       //get reviewId from req body
        


module.exports = router; 