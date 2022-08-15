const writerModel = require("../models/writers");
const fs = require("fs");

module.exports.getWritersCount = (req,res, next)=>{
    writerModel.find({}).count()
    .then((data) => {
        res.status(200).json({count:data})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.getAllWriters = (req,res, next)=>{
    let {page = 1, limit = 10} = req.query;

    // writerModel.find({})
    writerModel.aggregate([
        {
            $lookup:{
                from:"books",
                localField: '_id',
                foreignField: 'writer',
                as: 'books',
            }
        },
        {
            $project:{"books._id":0,"books.category":0, "books.description":0,"books.poster":0,
                    "books.source":0, "books.date_release":0, "books.lang":0,"books.n_pages":0,
                    "books.publisher":0, "books.price":0, "books.writer":0, "books.promotion":0,
                    "books.date_addition":0}
        },{
            
            $skip: (parseInt(page) - 1)*parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ])
    .then((data) => {
        let returned = {
            page:parseInt(page),
            data
        }
            res.status(200).json(returned)
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports.getWriterById = (req,res, next)=>{
    writerModel.findOne({_id:req.params.writerId})
    .then((data) => {
        if(data.length == 0){
            let err = new Error("writer is not found");
            err.status = 404;
            throw err
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
                let err = new Error("writer is not found");
                err.status = 404;
                throw err
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
            let err = new Error("writer is not found");
            err.status = 404;
            throw err
        }else{
            res.status(200).json(data);
        }
    })
    .catch((err) => {
        next(err);
    })
}
