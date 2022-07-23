const express = require("express");

const wishListsController = require("../controllers/wishListsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/api/wishes/:userId")
    .get(authMw, role.userORAdmin, wishListsController.getAllItems)    
    .post(authMw, role.mustUser, wishListsController.addItem)

router.route("/api/wishes/one/:userId")      //wishItemId in query string
        .get(authMw, role.userORAdmin, wishListsController.getOneItem)
        .delete(authMw, role.mustUser, wishListsController.deleteItem)

module.exports = router; 