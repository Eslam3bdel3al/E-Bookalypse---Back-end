const express = require("express");

const cartsController = require("../controllers/cartsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/cartItems/:userId") 
        .get(authMw, role.userORAdmin, cartsController.getAllItems) 

 router.route("/api/user/cartItem/:userId") 
        .post(authMw, role.mustUser, cartsController.addItem)
        .get(authMw, role.userORAdmin, cartsController.getOneItem)   //cartItemId in query string
        .delete(authMw, role.mustUser, cartsController.deleteItem)   //cartItemId in query string


module.exports = router; 