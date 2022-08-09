require("dotenv").config();

const { initializeApp } = require('firebase/app');
const {getStorage ,uploadString, ref,deleteObject} = require('firebase/storage');

const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMIN,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGE_SENDID,
    appId: process.env.FB_APPID,
    measurementId: process.env.FB_MEASUREMENT_ID
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

module.exports.deleteFilesFromFireBase = (req,res,next)=>{
    const path = 'uploads/books/'
    if(req.query){

        if(req.query.src){
            const deletePDF = ref(ourStorage,path+'pdf/'+req.query.src);
            // Delete the file
            deleteObject(deletePDF).then(() => {
                // File deleted successfully
                console.log("successfully deleted")
                }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error)
                next(error)
                });
    
        }
        if(req.query.icon){
            const deletePoster = ref(ourStorage,path+'poster/'+req.query.icon);
            // Delete the file
            deleteObject(deletePoster).then(() => {
                // File deleted successfully
                console.log("successfully deleted")
                }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error)
                next(error)
                });
        }
        next()
    }else{
        next()
    }




}

module.exports.updateFilesToFirebase = (req,res,next)=>{
    if(req.files){

        const path = 'uploads/books/'
        if(req.files.booksrc !== undefined){
            const pdf = req.files.booksrc[0];
            if(pdf.mimetype === "application/pdf"){
                let  pdfNewName = Date.now() + "_Ebookalypse_" + pdf.originalname;
                req.uploadedSrc = pdfNewName;
                const uploadPdf= ref(ourStorage,path+'/pdf/'+pdfNewName);
                const b64PDF = Buffer.from(pdf.buffer).toString('base64'); 
                const metadataPDF = {
                        contentType: pdf.mimetype,
                };   
                const deletePDF = ref(ourStorage,path+'pdf/'+req.body.oldSrc);
        
                deleteObject(deletePDF).then(() => {
                // File deleted successfully
                console.log("successfully deleted") 
                }).catch((error) => {
                // Uh-oh, an error occurred!
                next(error)
                
                });
                uploadString(uploadPdf, b64PDF, 'base64',metadataPDF).then((snapshot) => {
                           console.log('Uploaded a base64 string!');
                }).catch((err)=>(next(err)));
                
            }else{
                let err = new Error('File Must Be PDF Type')
                next(err)
            }
        }else{
            // send old pdf name
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
                        next(error)
                        
                        });
                    }
                    uploadString(uploadPoster, b64POSTER, 'base64',metadataPOSTER).then((snapshot) => {
                        console.log('Uploaded a base64 string!');
                      
                    }).catch((err)=>(next(err)));
                }else{
                    let err= new Error('Image Must Be in the format (JPG , JPEG , PNG )')
                    next(err)
                }

        }else{
            // send old image name

        }

        // if(req.files.bookimage !== undefined){
            //     const poster = req.files.bookimage[0]; 

            //     if(poster.mimetype === 'image/jpeg' || poster.mimetype === 'image/png' || poster.mimetype === 'image/jpg' ){
            //         console.log("right")
            //         let posterNewName =  Date.now() + "_Ebookalypse_" + poster.originalname;
    
            //         req.uploadedImage = posterNewName ; 
    
            //         const b64POSTER = Buffer.from(poster.buffer).toString('base64');  
    
            //         const uploadPoster= ref(ourStorage,path+'poster/'+posterNewName);
    
            //         const metadataPOSTER = {
            //             contentType: poster.mimetype,
            //         }; 
            //         if(req.body.oldImg !== './book.jpg'){

            //             const deleteImage = ref(ourStorage,path+'/poster/'+req.body.oldImg);
                        
            //             deleteObject(deleteImage).then(() => {
            //             // File deleted successfully
            //             console.log("successfully deleted")
            //             }).catch((error) => {
            //             // Uh-oh, an error occurred!
            //             console.log(error)
                        
            //             });
            //         }
            //         uploadString(uploadPoster, b64POSTER, 'base64',metadataPOSTER).then((snapshot) => {
            //             console.log('Uploaded a base64 string!');
            //             next()
            //         }).catch((err)=>(next(err)));
        
    
    
            //     }else{
            //         let err = new Error('IMG MUST BE JPG  , PNG ,JPEG ')
    
            //         next(err)
            //         // console.log("PDF MUST BE PDF ")
            //     }
            // }
        
        next()
    }else{
        next()
    }
}