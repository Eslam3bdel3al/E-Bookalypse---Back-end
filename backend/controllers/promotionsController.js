const Promotion = require("../models/promotions")



module.exports.getAllPromotions = (req,res,next) => {
    Promotion.aggregate([
        {
            $lookup:{
                from:"books",
                localField: '_id',
                foreignField: 'promotion',
                as: 'books',
            }
        },
        {
            $project:{"books.description":0,"books.source":0,"books.date_release":0,"books.n_pages":0,
                    "books.publisher":0,"books.category":0,"books.writer":0,"books.date_addition":0,
                    "books.promotion":0}
        }
    ])
    .then((data)=>{
        // data.forEach((promo)=>{
        //     let collectionPrice = 0
        //     let collectionFinalPrice = 0;

        //     promo.books.forEach((book)=>{
        //             book.finalPrice = (1-promo.discount_rate)*book.price;
        //             collectionPrice+= book.price;
        //             collectionFinalPrice+= book.finalPrice;
        //     })

        //     promo.collectionPrice = collectionPrice;
        //     promo.collectionFinalPrice = collectionFinalPrice;
        // })
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
            let err = new Error("Promotion not exists");
            err.status = 404;
            throw err
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports.updatePromotion = (req,res,next) => {
    console.log(req.body)
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
            let err = new Error("Promotion not exists");
            err.status = 404;
            throw err
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
            let err = new Error("Promotion not exists");
            err.status = 404;
            throw err
        }else{
            res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err);
    })
}