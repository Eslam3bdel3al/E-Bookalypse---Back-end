
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


module.exports.addFilesToFirebase = (req,res,next)=>{

    if(req.files){
        const path = 'uploads/books/'
        const pdf = req.files.booksrc[0];
        if(pdf.mimetype ==='application/pdf' ){
            let pdfNewName = Date.now() + "_Ebookalypse_" +pdf.originalname;

            req.uploadedSrc = pdfNewName ;

            const b64PDF = Buffer.from(pdf.buffer).toString('base64');  
            const uploadPdf= ref(ourStorage,path+'pdf/'+pdfNewName);


            const metadataPDF = {
                contentType: pdf.mimetype,
            }; 
            uploadString(uploadPdf, b64PDF, 'base64',metadataPDF).then((snapshot) => {
                console.log('Uploaded a base64 string!');
                
            }).catch((err)=>(next(err)));
            if(req.files.bookimage !== undefined){
                const poster = req.files.bookimage[0]; 

                if(poster.mimetype === 'image/jpeg' || poster.mimetype === 'image/png' || poster.mimetype === 'image/jpg' ){
                    console.log("right")
                    let posterNewName =  Date.now() + "_Ebookalypse_" + poster.originalname;
    
                    req.uploadedImage = posterNewName ; 
    
                    const b64POSTER = Buffer.from(poster.buffer).toString('base64');  
    
                    const uploadPoster= ref(ourStorage,path+'poster/'+posterNewName);
    
                    const metadataPOSTER = {
                        contentType: poster.mimetype,
                    }; 
    
                    uploadString(uploadPoster, b64POSTER, 'base64',metadataPOSTER).then((snapshot) => {
                        console.log('Uploaded a base64 string!');
                        next()
                    }).catch((err)=>(next(err)));
        
    
    
                }else{
                    let err = new Error('IMG MUST BE JPG  , PNG ,JPEG ')
    
                    next(err)
                    // console.log("PDF MUST BE PDF ")
                }
            }else{
                next()
            }
        }else{
            let err = new Error('PDF MUST BE PDF TYPE ')

            next(err)
            // console.log("IMG MUST BE JPG  , PNG ,JPEG")

            // console.log(req.files.bookimage[0].mimetype)
            
        }
        
    }


}

module.exports.deleteImageFromFirebase = (req,res,next)=>{
   
    
    const deletePDF = ref(ourStorage,req.mypath+req.query.source);
        // Delete the file
        deleteObject(deletePDF).then(() => {
            // File deleted successfully
            console.log("successfully deleted")
            next()
            }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error)
            next(error)
            });

    if(req.query.icon !== "noimage.png"){

        const deleteImage = ref(ourStorage,req.mypath+req.query.poster);
    
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

module.exports.updateFilesToFirebase = (req,res,next)=>{
    if(req.files){

        const path = 'uploads/books/'
        if( req.files.booksrc[0]){
            const pdf = req.files.booksrc[0];
            if(pdf.mimetype === 'application/pdf'){
                let  pdfNewName = Date.now() + "_Ebookalypse_" + pdf.originalname;
                req.uploadedSrc = pdfNewName;
                const uploadPdf= ref(ourStorage,path+'/pdf/'+pdfNewName);
                const b64PDF = Buffer.from(pdf.buffer).toString('base64'); 
                const metadataPDF = {
                        contentType: pdf.mimetype,
                };   
                const deletePDF = ref(ourStorage,path+'/pdf/'+req.body.oldSrc);
        
                deleteObject(deletePDF).then(() => {
                // File deleted successfully
                console.log("successfully deleted")
                }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error)
                
                });

                uploadString(uploadPdf, b64PDF, 'base64',metadataPDF).then((snapshot) => {
                           console.log('Uploaded a base64 string!');
                           next()
                }).catch((err)=>(next(err)));
            }else{
                let err = new Error("Pdf Must be a PDF file");
                next(err)
            }

        }
        if(req.files.bookimage !== undefined){
                const poster = req.files.bookimage[0]; 

                if(poster.mimetype === 'image/jpeg' || poster.mimetype === 'image/png' || poster.mimetype === 'image/jpg' ){
                    console.log("right")
                    let posterNewName =  Date.now() + "_Ebookalypse_" + poster.originalname;
    
                    req.uploadedImage = posterNewName ; 
    
                    const b64POSTER = Buffer.from(poster.buffer).toString('base64');  
    
                    const uploadPoster= ref(ourStorage,path+'poster/'+posterNewName);
    
                    const metadataPOSTER = {
                        contentType: poster.mimetype,
                    }; 
                    if(req.body.oldImg !== './book.jpg'){

                        const deleteImage = ref(ourStorage,path+'/poster/'+req.body.oldImg);
                        
                        deleteObject(deleteImage).then(() => {
                        // File deleted successfully
                        console.log("successfully deleted")
                        }).catch((error) => {
                        // Uh-oh, an error occurred!
                        console.log(error)
                        
                        });
                    }
                    uploadString(uploadPoster, b64POSTER, 'base64',metadataPOSTER).then((snapshot) => {
                        console.log('Uploaded a base64 string!');
                        next()
                    }).catch((err)=>(next(err)));
        
    
    
                }else{
                    let err = new Error('IMG MUST BE JPG  , PNG ,JPEG ')
    
                    next(err)
                    // console.log("PDF MUST BE PDF ")
                }
            }else{
                next()
            }
        
        // if(myFile.mimetype === 'image/jpeg' || myFile.mimetype === 'image/png' || myFile.mimetype === 'image/jpg'){
        //    let  fileNewName = Date.now() + "_Ebookalypse_" + myFile.originalname;
        //    req.uploadedImage = fileNewName
        //    const uploadsfile= ref(ourStorage,req.mypath+fileNewName);
        //    const b64 = Buffer.from(req.file.buffer).toString('base64');  
        //    const metadata = {
        //     contentType: myFile.mimetype,
        //   };            
        //    uploadString(uploadsfile, b64, 'base64',metadata).then((snapshot) => {
        //        console.log('Uploaded a base64 string!');
        //        next()
        //      }).catch((err)=>(next(err)));
        // }else{
        //     let err = new Error("Image Type Must Be JPG,PNG,JPEG")
        //     next(err)
        // }
        // if(req.body.oldIcon !== 'noimage.png'){
        //     const deleteImage = ref(ourStorage,req.mypath+req.body.oldIcon);
        
        //     // Delete the file
        //     deleteObject(deleteImage).then(() => {
        //     // File deleted successfully
        //     console.log("successfully deleted")
        //     }).catch((error) => {
        //     // Uh-oh, an error occurred!
        //     console.log(error)
            
        //     });
    
    
    
    
        // }
    }else{
        next()
    }
}