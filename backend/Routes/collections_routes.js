const express = require("express");

const collectionsController = require("../controllers/collectionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const collectionVal = require("../middlewares/validation/collection.val")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/collections")
    .get(collectionsController.getAllCollections)
    

router.route("/collection")
        .post(authMe, role.mustAdmin,collectionVal.collectioAdd,validationMw, collectionsController.addCollection)

router.route("/collection/:collectionId")
        .get(collectionVal.collectionParam, validationMw, collectionsController.getOneCollection)
        .put(authMe, role.mustAdmin,collectionVal.collectionEdit,validationMw, collectionsController.updateCollection)
        .delete(authMe, role.mustAdmin,collectionVal.collectionParam, validationMw, collectionsController.deleteCollection)
    
module.exports = router; 