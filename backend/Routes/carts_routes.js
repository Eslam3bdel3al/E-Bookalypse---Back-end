const express = require("express");

const cartsController = require("../controllers/cartsController");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/cart") 
        .get(authMw,role.mustUser, cartsController.getCart) 

 router.route("/cart-addition") 
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, cartsController.addItems)
        
router.route("/cart-removal") 
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, cartsController.deleteItems)   

// router.route("/api/user/cartItem/:cartItemId") 
//         .get(authMw, role.userORAdmin, cartsController.getOneItem)   


module.exports = router; 