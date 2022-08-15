const express = require("express");

const logsController = require("../controllers/logsController");
const authMw = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");

const router = express.Router();

router.route("/logs/:date")
    // .get(authMw, role.mustAdmin, logsController.getAllLogs)    
    .get(logsController.getAllLogs)    

module.exports = router; 