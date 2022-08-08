const express = require("express");

const collectionsController = require("../controllers/collectionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/collections")
    .get(collectionsController.getAllCollections)
    

router.route("/collection")
        .post(authMe, role.mustAdmin,valArrays.collectioAddEdit,validationMw, collectionsController.addCollection)

router.route("/collection/:collectionId")
        .get(collectionsController.getOneCollection)
        .put(authMe, role.mustAdmin,valArrays.collectioAddEdit,validationMw, collectionsController.updateCollection)
        .delete(authMe, role.mustAdmin, collectionsController.deleteCollection)
    
module.exports = router; 