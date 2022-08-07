const express = require("express");

const collectionsController = require("../controllers/collectionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/api/collections")
    .get(collectionsController.getAllCollections)
    

router.route("/api/admin/collection")
        .post(authMe, role.mustAdmin,valArrays.collectioAddEdit,validationMw, collectionsController.addCollection)

router.route("/api/admin/collection/:collectionId")
        .put(authMe, role.mustAdmin,valArrays.collectioAddEdit,validationMw, collectionsController.updateCollection)

router.route("/api/collection/:collectionId")
        .get(collectionsController.getOneCollection)

router.route("/api/admin/collection/:collectionId")
        .delete(authMe, role.mustAdmin, collectionsController.deleteCollection)
    
module.exports = router; 