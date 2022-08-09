require("dotenv").config();

const http = require('http');
const mongoose = require('mongoose');

const app = require('./backend/app');


const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';
const DATABASE = process.env.DATABASE


app.set('PORT',port)
const server = http.createServer(app)


mongoose.connect(DATABASE)
.then(()=>{
    server.listen(port,()=>{
        console.log(`we are listening to 'http://${host}:${port}/'`)
    })
})
.catch((err)=>{console.log(err)})

