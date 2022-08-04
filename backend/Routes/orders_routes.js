const express = require("express");

const ordersController = require("../controllers/ordersController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/orders/:userId?")
        .get(authMW, role.userORAdmin, ordersController.getAllOrders)

router.route("/api/user/order")      
        .post(authMW, role.mustUser, ordersController.addOrder) 

router.route("/api/user/order/:orderId")    
        .get(authMW, role.userORAdmin, ordersController.getOneOrder) 
        .delete(authMW, role.mustUser, ordersController.deleteOrder)   
        
router.route("/api/user/order/addBook")
        .put(authMW, role.mustUser, ordersController.addBookToOrder)

router.route("/api/user/order/removeBook")
        .put(authMW, role.mustUser, ordersController.removeBookFromOrder)

router.route("/api/admin/order/changeState")
        .put(authMW, role.mustAdmin, ordersController.changeOrderState)
module.exports = router; 