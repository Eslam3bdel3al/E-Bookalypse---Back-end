const writerModel = require("../models/writers");
const fs = require("fs");

module.exports.getAllWriters = (req,res)=>{

    writerModel.find({}).then((writers) =>{ res.status(200).send({writers})}    )

}

module.exports.getWriterById = (req,res)=>{
    writerModel.findOne({_id:req.params.writerId})
    .then(writer=>{
        res.status(200).send({writer})
    })
}

module.exports.addWriter = (req,res)=>{
    // let newWriter = new writerModel(req.body)
    // newWriter.save()
    // console.log(req.file)
    // console.log(req.bookimage)
    let newWriter = new writerModel({
        name:req.body.name,
        date_birth:req.body.date_birth,
        place_birth:req.body.place_birth,
        bio:req.body.bio,
        gender:req.body.gender,
        image:req.uploadedImage
        
    })

    newWriter.save()
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




module.exports.updateWriter = (req,res)=>{
  // console.log(req.params.bookId)
//   console.log(req.body)

  if(req.uploadedImage !== undefined){
      const myPath = "./public/uploads/writers/";

          req.body.image = req.uploadedImage
                // if(req.body.oldImg !== 'undefined' && req.body.oldImg !== 'user.jpg'){

                //     fs.unlinkSync(myPath+req.body.oldImg )
                // }

  }
  writerModel.updateOne({_id:req.params.writerId},req.body,
  (err,docs)=>{
      if(err){
          console.log(err)
      }else{
          console.log("updated docs "+ docs)
      }
  }
  
  )
  // console.log(req.body)
  res.send("ok")
}

module.exports.deleteWriter = (req,res)=>{
    writerModel.deleteOne({_id:req.params.writerId}).then(writer=>{
        res.status(200).send({writer})
    })
}