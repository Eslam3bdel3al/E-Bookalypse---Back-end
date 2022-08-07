
const { initializeApp } = require('firebase/app');
const {getStorage ,uploadString, ref,deleteObject} = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyBOuVim2ABTswgW1yG_BE6OKTN1yY0Q_Ps",
    authDomain: "e-bookalypse.firebaseapp.com",
    projectId: "e-bookalypse",
    storageBucket: "e-bookalypse.appspot.com",
    messagingSenderId: "929048486935",
    appId: "1:929048486935:web:44f1d45b73a273b3886852",
    measurementId: "G-Q56VX7NGC8"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const ourStorage = getStorage(app)


module.exports.addImageToFirebase = (req,res,next)=>{
    if(req.file){
        const myFile = req.file;
        if(myFile.mimetype === 'image/jpeg' || myFile.mimetype === 'image/png' || myFile.mimetype === 'image/jpg'){
           let  fileNewName = Date.now() + "_Ebookalypse_" + myFile.originalname;
           req.uploadedImage = fileNewName
           const uploadsfile= ref(ourStorage,req.mypath+fileNewName);
           const b64 = Buffer.from(req.file.buffer).toString('base64');  
           const metadata = {
            contentType: myFile.mimetype,
          };            
           uploadString(uploadsfile, b64, 'base64',metadata).then((snapshot) => {
               console.log('Uploaded a base64 string!');
               next()
             }).catch((err)=>(next(err)));
        }else{
            let err = new Error("Image Type Must Be JPG,PNG,JPEG")
            next(err)
        }

    }else{
        next()
    }

}

module.exports.deleteImageFromFirebase = (req,res,next)=>{
    // console.log(req.params)
    // Create a reference to the file to delete
    if(req.query.icon !== "noimage.png"){

        const deleteImage = ref(ourStorage,req.mypath+req.query.icon);
    
        // Delete the file
        deleteObject(deleteImage).then(() => {
        // File deleted successfully
        console.log("successfully deleted")
        next()
        }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
        next(error)
        });
    }else{
        next()
    }

}

module.exports.updateImageFromFirebase = (req,res,next)=>{
    console.log(req.body.oldIcon)
    if(req.file){
        const myFile = req.file;
        if(myFile.mimetype === 'image/jpeg' || myFile.mimetype === 'image/png' || myFile.mimetype === 'image/jpg'){
           let  fileNewName = Date.now() + "_Ebookalypse_" + myFile.originalname;
           req.uploadedImage = fileNewName
           const uploadsfile= ref(ourStorage,req.mypath+fileNewName);
           const b64 = Buffer.from(req.file.buffer).toString('base64');  
           const metadata = {
            contentType: myFile.mimetype,
          };            
           uploadString(uploadsfile, b64, 'base64',metadata).then((snapshot) => {
               console.log('Uploaded a base64 string!');
               next()
             }).catch((err)=>(next(err)));
        }else{
            let err = new Error("Image Type Must Be JPG,PNG,JPEG")
            next(err)
        }
        if(req.body.oldIcon !== 'noimage.png' && req.body.oldIcon !== 'user.png'){
            const deleteImage = ref(ourStorage,req.mypath+req.body.oldIcon);
        
            // Delete the file
            deleteObject(deleteImage).then(() => {
            // File deleted successfully
            console.log("successfully deleted")
            }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error)
            
            });
    
    
    
    
        }
    }else{
        next()
    }
}