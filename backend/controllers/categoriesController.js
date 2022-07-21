const categoryModel = require("../models/categories")
const fs = require('fs');


module.exports.getAllCategories = (req,res)=>{
    categoryModel.find({}).then(
       categories => res.status(200).send({categories})
    )
}

module.exports.addCategory = (req,res)=>{
    let newCat = new categoryModel({
        title:req.body.cattitle,
        icon:req.uploadedImage
    })
    newCat.save()
    // console.log(req.body)
    // console.log(req.body)
    res.status(200).send("added successfully");

}

module.exports.deleteCategory = (req,res)=>{


    categoryModel.deleteOne({_id:req.params.catId}).then(category=>{
        res.status(200).send("deleted successfully" + {category})
    })

}

module.exports.updateCategory = (req,res)=>{
    if(req.uploadedImage !== undefined){
        const myPath = "./public/uploads/categories/";
        if(req.body.oldIcon !== 'undefined'){
            fs.unlinkSync(myPath+req.body.oldIcon)
            // console.log(myPath+req.body.oldIcon)
        }
        // req.body.icon = req.uploadedImage

        console.log(req.body.oldIcon)
   

    }

    categoryModel.updateOne({_id:req.params.catId},{
        title:req.body.title,
        icon : req.uploadedImage
    }).then((category)=>res.status(200).send("updated Successfully"))
    // console.log(req.body)


}
module.exports.getCategory = (req,res)=>{
    categoryModel.findOne({_id:req.params.catId}).then((category)=>res.status(200).send({category}))

}
