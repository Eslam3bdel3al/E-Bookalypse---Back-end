const express = require("express");

const contactUsController = require("../controllers/contactUsController");
const contactVal = require("../middlewares/validation/contact.val");
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/contact-us")
    .post(contactVal.contactVal,validationMw,contactUsController.contactWithUs)    

module.exports = router; 