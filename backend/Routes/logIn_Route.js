const express = require("express");

const loginController = require("../controllers/loginController");

const authMW = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.post("/login",authMW, role.mustAdmin, loginController.toLogin);

module.exports = router