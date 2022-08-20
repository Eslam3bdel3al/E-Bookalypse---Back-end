const express = require("express");

const publishWithController = require("../controllers/publishWithController");
const publishVal = require("../middlewares/validation/publish.val");
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/contact-us")
    .post(publishVal.publishVal,validationMw,publishWithController.publishWithUs)    

module.exports = router; 