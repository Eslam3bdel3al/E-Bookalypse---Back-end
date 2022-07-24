const express = require("express");

const promotionsController = require("../controllers/promotionsController");
const authMe = require("../middlewares/authMw");
const role = require("../middlewares/checkRole");
const valArrays = require("../middlewares/ValArrays")
const validationMw = require("../middlewares/validationMw");

const router = express.Router();

router.route("/api/promotions")
    .get(promotionsController.getAllPromotions)
    

router.route("/api/admin/promotion")
        .post(authMe, role.mustAdmin,valArrays.promotionAddEdit,validationMw, promotionsController.addPromotion)
        .put(authMe, role.mustAdmin,valArrays.promotionAddEdit,validationMw, promotionsController.updatePromotion)

router.route("/api/promotion/:title")
            .get(promotionsController.getOnePromotion)

router.route("/api/admin/promotion/:title")
        .delete(authMe, role.mustAdmin, promotionsController.deletePromotion)
    
module.exports = router; 