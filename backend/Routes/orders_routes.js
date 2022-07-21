const express = require("express");

const ordersController = require("../controllers/ordersController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/orders/:userId")
        .get(authMW, role.userORAdmin, ordersController.getAllOrders)
        .post(authMW, role.mustUser, ordersController.addOrder)

router.route("/api/orders/one/:userId")    //orderId in query string
        .get(authMW, role.userORAdmin, ordersController.getOneOrder)
        .delete(authMW, role.mustUser, ordersController.deleteOrder)

router.route("/api/orders/addBook/:userId")
        .put(authMW, role.mustUser, ordersController.addBookToOrder)

router.route("/api/orders/removeBook/:userId")
        .put(authMW, role.mustUser, ordersController.removeBookFromOrder)

router.route("/api/orders/changeState")
        .put(authMW, role.mustAdmin, ordersController.changeOrderState)
module.exports = router; 