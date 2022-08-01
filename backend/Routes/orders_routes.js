const express = require("express");

const ordersController = require("../controllers/ordersController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/orders/:userId")
        .get(authMW, role.userORAdmin, ordersController.getAllOrders)

router.route("/api/user/order/:userId")    
        // .get(authMW, role.userORAdmin, ordersController.getOneOrder)   //orderId in query string
        // .delete(authMW, role.mustUser, ordersController.deleteOrder)   //orderId in query string
        .delete( ordersController.deleteOrder)                             //orderId in query string
        // .post(authMW, role.mustUser, ordersController.addOrder)       
        .post(ordersController.addOrder)       


router.route("/api/user/order/addBook/:userId")
        // .put(authMW, role.mustUser, ordersController.addBookToOrder)
        .put( ordersController.addBookToOrder)

router.route("/api/user/order/removeBook/:userId")
        // .put(authMW, role.mustUser, ordersController.removeBookFromOrder)
        .put( ordersController.removeBookFromOrder)

router.route("/api/admin/order/changeState")
        .put(authMW, role.mustAdmin, ordersController.changeOrderState)
module.exports = router; 