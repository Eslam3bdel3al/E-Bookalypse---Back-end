const http = require('http');
const mongoose = require('mongoose');

const app = require('./backend/app');
require("dotenv").config();


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const DATABASE = process.env.DATABASE || 'mongodb+srv://EBookalypse:rWCaMtf7016NIOPs@cluster0.jgx2q.mongodb.net/BookStore?retryWrites=true&w=majority'


app.set('PORT',PORT)
const server = http.createServer(app)

// mongoose connect 
// mongoose.connect('mongodb://localhost:27017/BookStore')
// mongoose.connect(DATABASE)
// .then(()=>{
    server.listen(PORT,()=>{
        console.log(`we are listening to ${HOST}:${PORT}/'`)
    })
// })
// .catch((err)=>{console.log(err)})

