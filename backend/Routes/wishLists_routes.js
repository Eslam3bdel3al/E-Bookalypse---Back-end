const express = require("express");

const wishListsController = require("../controllers/wishListsController");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/wish-list")
    .get(authMw, role.mustUser, wishListsController.getwishList)    

router.route("/wish-addition")      
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, wishListsController.addItems)

router.route("/wish-removal")      
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, wishListsController.deleteItems)    

module.exports = router; 