const express = require("express");

const cartsController = require("../controllers/cartsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/cartItems/:userId?") 
        .get(authMw, role.userORAdmin, cartsController.getAllItems) 

 router.route("/api/user/cartItem") 
        .post(authMw, role.mustUser, cartsController.addItem)

router.route("/api/user/cartItem/:cartItemId") 
        .get(authMw, role.userORAdmin, cartsController.getOneItem)   
        .delete(authMw, role.mustUser, cartsController.deleteItem)   


module.exports = router; 