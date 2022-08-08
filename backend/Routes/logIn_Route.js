const express = require("express");

const loginController = require("../controllers/loginController");

const router = express.Router();

router.post("/login", loginController.toLogin);

module.exports = router