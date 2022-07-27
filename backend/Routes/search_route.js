const express = require("express");

const searchController = require("../controllers/searchController")

const router = express.Router();



router.route('/api/search/:key')
      .get(searchController.navSearch)


module.exports = router; 