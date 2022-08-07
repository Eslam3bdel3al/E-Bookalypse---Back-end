const Collection = require("../models/collections")

module.exports.getAllCollections = (req,res,next) => {
    Collection.aggregate([
        {
            $lookup:{
                from:"books",
                localField: 'collectionBooks',
                foreignField: '_id',
                as: 'collectionBooks',
            }
        },
        {
            $project:{"books.description":0,"books.source":0,"books.date_release":0,"books.n_pages":0,
                    "books.publisher":0,"books.category":0,"books.writer":0,"books.date_addition":0,
                    "books.promotion":0}
        }
    ])
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch((err) => {
        next(err);
    })
};

module.exports.addCollection = (req,res,next) => {
    let object = new Collection ({
        title: req.body.title,
        description: req.body.description,
        collectionPrice: req.body.collectionPrice,
        collectionBooks:req.body.collectionBooks,
    })

    object.save()
    .then((data)=>{
        res.status(201).json({data: "added"});
    })
    .catch((err) => {
        next(err)
    })
};

module.exports.getOneCollection = (req,res,next) => {

    Collection.findOne({_id:req.params.collectionId})
    .then((data) => {
        if(data == null){
            throw new Error("Collection not exists")
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports.updateCollection = (req,res,next) => {
    console.log(req.body)
    Collection.updateOne({_id:req.params.collectionId},{
        $set:{
            title: req.body.title,
            description: req.body.description,
            collectionPrice: req.body.collectionPrice,
            collectionBooks:req.body.collectionBooks,
        }
    }).then((data) => {
        if(data.matchedCount == 0){
            throw new Error("collection is not found");
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
};

module.exports.deleteCollection = (req,res,next) => {
    Collection.deleteOne({_id:req.params.collectionId})
    .then((data) => {
        if(data.deletedCount == 0){
            throw new Error("collection is not found");
        }else{
            res.status(200).json({data:"deleted"});
        }
    })
    .catch((err) => {
        next(err);
    })
}