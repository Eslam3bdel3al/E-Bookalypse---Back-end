const http = require('http');
const mongoose = require('mongoose');

const app = require('./backend/app');
require("dotenv").config();


const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';
const DATABASE = process.env.DATABASE || 'mongodb+srv://EBookalypse:rWCaMtf7016NIOPs@cluster0.jgx2q.mongodb.net/BookStore?retryWrites=true&w=majority'


app.set('PORT',port)
const server = http.createServer(app)

// mongoose connect 
// mongoose.connect('mongodb://localhost:27017/BookStore')
// mongoose.connect(DATABASE)
// .then(()=>{
    server.listen(port,()=>{
        console.log(`we are listening to ${host}:${port}/'`)
    })
// })
// .catch((err)=>{console.log(err)})

