require("dotenv").config();

const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sgTransport({
    auth:{
        api_key: process.env.TRANSPORTER_API_KEY
    }
}));


module.exports.publishWithUs = (req,res,next) => {
    let {fName,lName,email,phone,title,description} = req.body;
    let content = `<dev><p>message: ${description}</p><p>name: ${fName} ${lName}</p><p>email: ${email}</p><p>phone: ${phone}</p></dev>`
        transporter.sendMail({
            to:"abdelalleslam@gmail.com",
            from: "abdelalleslam@gmail.com",
            subject: title,
            html:content
        }).then((data)=>{
            res.status(201).json({msg: "mail sent"})
        }).catch((err)=>{
            next(err)
        })
    
}