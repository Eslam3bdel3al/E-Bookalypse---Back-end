const writerModel = require("../models/writers");
const fs = require("fs");

modmodule.exports.getAllWriters = (req,res, next)=>{

    let {page = 1, limit = 10} = req.query;

    writerModel.find({})
    .limit(limit).skip((page - 1)*limit)
    .then((data) => {
        writerModel.countDocuments().then((count)=>{
            let returned = {
                n_results : count,
                n_pages : Math.ceil(count/limit),
                page,
                data
            }
            res.status(200).json(returned)
        }).catch((err)=>{next(err)})})
    .catch((err)=>{
        next(err)
    })
}


module.exports.getWriterById = (req,res, next)=>{
    writerModel.findOne({_id:req.params.writerId})
    .then((data) => {
        if(data == null){
        next(new Error("writer is not found"));
        }else{
            res.status(200).json(data);
        }

    })
    .catch((err) => {
        next(err);
    })
}

module.exports.addWriter = (req, res, next)=>{
    
    let newWriter = new writerModel({
        name:req.body.name,
        date_birth:req.body.date_birth,
        place_birth:req.body.place_birth,
        bio:req.body.bio,
        gender:req.body.gender,
        image:req.uploadedImage
        
    })


    newWriter.save()
    .then((data) => {
        res.status(201).json({data: "added"})
    })
    .catch( (err) => {
        console.log(err)
        next(err)
    })
}


// I've just used to add many writers for the first time
module.exports.addWriters = (req,res,next)=>{
      
    writerModel.insertMany(req.body.writers)
            .then((data) => {
                res.status(201).json({data: "added"})
            })
            .catch( (err) => {
                console.log(err)
                next(err)
            })

    
}




module.exports.updateWriter = (req,res,next)=>{

  if(req.uploadedImage !== undefined){
      const myPath = "./public/uploads/writers/";

          req.body.image = req.uploadedImage
                // if(req.body.oldImg !== 'undefined' && req.body.oldImg !== 'user.jpg'){

                //     fs.unlinkSync(myPath+req.body.oldImg )
                // }

  }

  writerModel.updateOne({_id:req.params.writerId},{
            $set:{
                name:req.body.name,
                date_birth:req.body.date_birth,
                place_birth:req.body.place_birth,
                bio:req.body.bio,
                gender:req.body.gender,
                image:req.uploadedImage
            }
        }).then((data) => {
            if(data.matchedCount == 0){
                next(new Error("writer is not found"));
            }else{
                res.status(200).json(data);
            }
        }).catch((err) => {
            next(err);
        })

}


module.exports.deleteWriter = (req,res,next)=>{
    writerModel.deleteOne({_id:req.params.writerId})
    .then((data) => {
        if(data.deletedCount == 0){
            next(new Error("writer is not found"));
        }else{
            res.status(200).json(data);
        }
    })
    .catch((err) => {
        next(err);
    })
}
