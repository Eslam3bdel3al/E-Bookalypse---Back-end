const express = require("express");

const cartsController = require("../controllers/cartsController");
const cartVal = require("../middlewares/validation/wishCart.val");
const validationMw = require("../middlewares/validationMw");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/cart") 
        .get(authMw,role.mustUser, cartsController.getCart) 

 router.route("/cart-addition") 
        .put(authMw, role.mustUser, cartsController.addItems)
        
router.route("/cart-removal") 
        .put(authMw, role.mustUser,cartVal.wcAddRemove, validationMw, cartsController.deleteItems)  
        
router.route("/check-out")
        .get(authMw, role.mustUser,cartVal.wcAddRemove, validationMw, cartsController.checkOut)

// router.route("/api/user/cartItem/:cartItemId") 
//         .get(authMw, role.userORAdmin, cartsController.getOneItem)   


module.exports = router; 