require("dotenv").config();
  
  const express = require('express');


const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';


  const loginRouters =require("./Routes/logIn_Route")
  const usersRouters = require("./Routes/users_routes");
  const booksRoutes=  require('./Routes/books_routes');
  const categoriesRouters = require("./Routes/categories_routes");
  const writersRouters = require("./Routes/writers_routes");
  const promotionsRouters = require("./Routes/promotions_router");
  const ordersRouters = require("./Routes/orders_routes");
  const reviewsRouters = require("./Routes/reviews_routes");
  const cartsRouters = require("./Routes/carts_routes");
  const wishListRouters = require("./Routes/wishLists_routes");
  const logsRouters = require("./Routes/logs_routes");
  const searchRouters = require("./Routes/search_route");
  const collectionRouters = require("./Routes/collections_routes");
  const contactUsRouters = require("./Routes/contactus_routes");
  const publishWithRouters = require("./Routes/publishWith_routes");

  const verifyToken = require("./middlewares/verifyToken");
  const logger = require("./middlewares/logger")

  const app = express();


  app.use((req,res,next)=>{
    // * : no matter which domain is dsending the request is allowed to access our resources
    res.setHeader('Access-Control-Allow-Origin', '*');
    // the incoming request may have these headers
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type, Accept , Authorization')
    // the incoming METHODS
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS')
    
    next();
  })
  
  
  app.use(express.json())
  app.use(express.urlencoded({extended:true}))

  
  app.use(verifyToken);

 app.use(logger)

  app.get('/', (req, res) => {   res.send("WELCOME " + process.env.PORT  ) })
  app.use(loginRouters)
  app.use(usersRouters);
  app.use(booksRoutes);
  app.use(categoriesRouters);
  app.use(writersRouters);
  app.use(promotionsRouters);
  app.use(ordersRouters);
  app.use(reviewsRouters);
  app.use(cartsRouters);
  app.use(wishListRouters);
  app.use(logsRouters);
  app.use(searchRouters);
  app.use(collectionRouters);
  app.use(contactUsRouters);
  app.use(publishWithRouters);


  //not found response 
  app.use((req,res)=>{
    res.status(404).send("NOT FOUND")
  })

  

  //catch all errors
  app.use((err,req,res,next)=>{
    res.status(err.status||500).send({message:"err: "+err.message})
  })

  module.exports=app;