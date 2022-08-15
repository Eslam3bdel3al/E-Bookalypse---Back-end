const express = require("express");

const ordersController = require("../controllers/ordersController");
const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/orders-count")
        .get(authMW, role.mustAdmin, ordersController.getOrdersCount)

router.route("/orders/:userId?")
        .get(authMW, role.userORAdmin, ordersController.getAllUserOrders)

router.route("/order")      
        .post(authMW, role.mustUser, ordersController.addOrder) 

router.route("/order/:orderId")    
        .get(authMW, role.userORAdmin, ordersController.getOneOrder) 
        // .delete(authMW, role.mustUser, ordersController.deleteOrder)   
        
// router.route("/order/add-book")
//         .put(authMW, role.mustUser, ordersController.addBooksToOrder)

// router.route("/order/remove-book")
//         .put(authMW, role.mustUser, ordersController.removeBooksFromOrder)

// router.route("/order/change-state")
//         .put(authMW, role.mustAdmin, ordersController.changeOrderState)




module.exports = router; 