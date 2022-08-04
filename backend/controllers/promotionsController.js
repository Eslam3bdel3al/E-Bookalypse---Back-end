const Promotion = require("../models/promotions")



module.exports.getAllPromotions = (req,res,next) => {
    Promotion.find({})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch((err) => {
        next(err);
    })
};

module.exports.addPromotion = (req,res,next) => {
    let object = new Promotion ({
        title: req.body.title,
        description: req.body.description,
        discount_rate: req.body.discountRate,
        start_date: req.body.startDate,
        end_date: req.body.endDate
    })

    object.save()
    .then((data)=>{
        res.status(201).json({data: "added"});
    })
    .catch((err) => {
        next(err)
    })
};

module.exports.getOnePromotion = (req,res,next) => {

    Promotion.findOne({_id:req.params.promotionId})
    .then((data) => {
        if(data == null){
            next( new Error("Promotion not exists"))
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports.updatePromotion = (req,res,next) => {
    Promotion.updateOne({_id:req.params.promotionId},{
        $set:{
            title: req.body.title,
            description: req.body.description,
            discount_rate: req.body.discountRate,
            start_date: req.body.startDate,
            end_date: req.body.endDate
        }
    }).then((data) => {
        if(data.matchedCount == 0){
            next(new Error("user is not found"));
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

module.exports.deletePromotion = (req,res,next) => {
    Promotion.deleteOne({_id:req.params.promotionId})
    .then((data) => {
        if(data.deletedCount == 0){
            next(new Error("promotion is not found"));
        }else{
            res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err);
    })
}