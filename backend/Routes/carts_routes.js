const express = require("express");

const cartsController = require("../controllers/cartsController");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/cart/cartItems") 
        .get(authMw,role.mustUser, cartsController.getCart) 

 router.route("/api/user/addCartItem") 
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, cartsController.addItems)
        
router.route("/api/user/removeCartItem") 
        .put(authMw, role.mustUser,valArrays.cartItems,validationMw, cartsController.deleteItems)   

// router.route("/api/user/cartItem/:cartItemId") 
//         .get(authMw, role.userORAdmin, cartsController.getOneItem)   


module.exports = router; 