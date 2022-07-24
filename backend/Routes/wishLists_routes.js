const express = require("express");

const wishListsController = require("../controllers/wishListsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/user/wisheItems/:userId")
    .get(authMw, role.userORAdmin, wishListsController.getAllItems)    

router.route("/api/user/wisheItem/:userId")      
        .post(authMw, role.mustUser, wishListsController.addItem)
        .get(authMw, role.userORAdmin, wishListsController.getOneItem)    //wishItemId in query string
        .delete(authMw, role.mustUser, wishListsController.deleteItem)    //wishItemId in query string

module.exports = router; 