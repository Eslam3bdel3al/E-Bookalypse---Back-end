const express = require("express");

const wishListsController = require("../controllers/wishListsController");
const wishVal = require("../middlewares/validation/wishCart.val");
const validationMw = require("../middlewares/validationMw");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/wish-list")
    .get(authMw, role.mustUser, wishListsController.getwishList)    

router.route("/wish-addition")      
        .put(authMw, role.mustUser,wishVal.wcAddRemove, validationMw, wishListsController.addItems)

router.route("/wish-removal")      
        .put(authMw, role.mustUser,wishVal.wcAddRemove, validationMw, wishListsController.deleteItems)    

module.exports = router; 