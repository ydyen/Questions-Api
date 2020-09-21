'use strict';

//initial setup and assignment
const express = require('express');
const app = express();
const port = process.env.Port || 3000;
const jsonparser = require('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');
const mongoose = require('mongoose');

/***  middlewares  **/
//parses the body as json format
app.use(jsonparser());

//reads and use the module inside routes.js file
app.use('/questions', routes);

//gives status codes error in the api responses
app.use(logger('dev'));


//db connection
mongoose.connect('mongodb://localhost:27017/sandbox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//monitor session
const db = mongoose.connection;

//check error
db.on('error', (error) => console.log(error));

//monitor open session
db.once('open', () => {
    console.log('db connection successful');
})

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*"); //allows frontend access from anywhere
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept"); //allowed headers
    if(req.method === "OPTIONS"){ // allow methods update, create, and delete
        res.header("Access-Control-Allow-Methods", "Put, Post, Delete");
        return res.status(200).json({});
    }
    next(); //next middleware request
})

//Handles 404 error
app.use((req, res, next) =>{
    //error object assignment
    const err = new Error("Not Found");
    //provides a 404 status code
    err.status = 404;
    //pass error to the next middleware
    next(err);
})

//Error handler, 500
app.use((err, req, res, next) =>{
    //response status pass the error based on the previous error status or use status 500
    res.status(err.status || 500);
    res.json({
        error: {
            Message: err.message
        }
    })
})

//running the server on port 3000 or process.env.Port
app.listen(port, () => console.log('Server running on port ' + port));

//Cors - Cross Origin Resource Sharing
//Authentication
//Authorization 