const categoryModel = require("../models/categories")
const fs = require('fs');


module.exports.getAllCategories = (req,res,next)=>{
    categoryModel.find({})
    .then(
       categories => res.status(200).json({categories})
    ).catch((err) => {
        next(err)
    })
}

module.exports.addCategory = (req,res,next)=>{
    let newCat = new categoryModel({
        title:req.body.catTitle,
        icon:req.uploadedImage
    })
    newCat.save()
            .then((data)=> res.status(201).json({data: "added"}))
            .catch((err)=>next(err));

}

module.exports.deleteCategory = (req,res,next)=>{

    categoryModel.deleteOne({_id:req.params.catId})
        .then((data) => {
            if(data.deletedCount == 0){
                next(new Error("category is not found"));
            }else{
                res.status(200).json(data);
            }
        })
        .catch((err) => {
            next(err);
        })
}

module.exports.updateCategory = (req,res,next)=>{
  
    categoryModel.updateOne({_id:req.params.catId},{
        title:req.body.catTitle,
        icon : req.uploadedImage
    }).then((data)=>{
        if(data.matchedCount == 0){
            next(new Error("category is not found"));
        }else{
            res.status(200).json(data);
        }
    }).catch((err) => {
        next(err);
    })
}




module.exports.getCategory = (req,res,next)=>{
    categoryModel.findOne({_id:req.params.catId})
        .then((data) => {
            if(data == null){
            next(new Error("category is not found"));
            }else{
                res.status(200).json(data);
            }

        })
        .catch((err) => {
            next(err);
        })
}
