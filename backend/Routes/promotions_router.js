const express = require("express");

const promotionsController = require("../controllers/promotionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const pomotionVal = require("../middlewares/validation/promotion.val")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/promotions")
    .get(promotionsController.getAllPromotions)
    

router.route("/promotion")
        .post(authMe, role.mustAdmin,pomotionVal.promotionAdd,validationMw, promotionsController.addPromotion)

router.route("/promotion/:promotionId")
        .get(pomotionVal.promotionParam,validationMw, promotionsController.getOnePromotion)
        .put(authMe, role.mustAdmin,pomotionVal.promotionEdit,validationMw, promotionsController.updatePromotion)
        .delete(authMe, role.mustAdmin, pomotionVal.promotionParam, validationMw, promotionsController.deletePromotion)
    
module.exports = router; 