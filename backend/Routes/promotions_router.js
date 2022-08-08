const express = require("express");

const promotionsController = require("../controllers/promotionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/promotions")
    .get(promotionsController.getAllPromotions)
    

router.route("/promotion")
        .post(authMe, role.mustAdmin,valArrays.promotionAddEdit,validationMw, promotionsController.addPromotion)

router.route("/promotion/:promotionId")
        .get(promotionsController.getOnePromotion)
        .put(authMe, role.mustAdmin,valArrays.promotionAddEdit,validationMw, promotionsController.updatePromotion)
        .delete(authMe, role.mustAdmin, promotionsController.deletePromotion)
    
module.exports = router; 