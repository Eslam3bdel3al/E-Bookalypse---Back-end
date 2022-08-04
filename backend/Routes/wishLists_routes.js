const express = require("express");

const wishListsController = require("../controllers/wishListsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/wisheItems/:userId?")
    .get(authMw, role.userORAdmin, wishListsController.getAllItems)    

router.route("/api/user/wisheItem")      
        .post(authMw, role.mustUser, wishListsController.addItem)

router.route("/api/user/wisheItem/:wishItemId")      
        .get(authMw, role.userORAdmin, wishListsController.getOneItem)    
        .delete(authMw, role.mustUser, wishListsController.deleteItem)    

module.exports = router; 